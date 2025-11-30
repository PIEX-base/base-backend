import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FrequenciaRepository } from "./repositories/frequencia.repository";
import { CreateFrequenciaDto } from "./dto/create-frequencia.dto";
import { UpdateFrequenciaDto } from "./dto/update-frequencia.dto";
import { Prisma } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FrequenciaService {
  private readonly logger = new Logger(FrequenciaService.name);

  constructor(
    private readonly repository: FrequenciaRepository,
    private readonly snowflakeService: SnowflakeService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async create(createFrequenciaDto: CreateFrequenciaDto) {
    const { id_matricula } = createFrequenciaDto;

    // 1. Encontrar a matrícula correspondente à pessoa e atividade
    const matricula = await this.prisma.matriculaAtividade.findUnique({
      where: {
        id_matricula: id_matricula,
      },
    });

    if (!matricula) {
      throw new NotFoundException(`Nenhuma matrícula ativa encontrada para esta pessoa nesta atividade`);
    }
    if (matricula.status !== "ATIVA") {
      throw new BadRequestException("A matrícula desta pessoa na atividade não está ativa nesta atividade.");
    }

    const id = this.snowflakeService.generate();

    // 2. Criar a frequência usando o id_matricula
    const frequenciaData: Prisma.FrequenciaCreateInput = {
      id_frequencia: id,
      data: createFrequenciaDto.data,
      presenca: createFrequenciaDto.presenca,
      justificativa: createFrequenciaDto.justificativa || null,
      matricula: {
        connect: {
          id_matricula: matricula.id_matricula,
        },
      },
    };

    const novaFrequencia = await this.repository.create(frequenciaData);

    // 3. Verificar faltas não justificadas
    if (!createFrequenciaDto.presenca && !createFrequenciaDto.justificativa) {
      const faltasNaoJustificadas = await this.prisma.frequencia.count({
        where: {
          id_matricula: matricula.id_matricula,
          presenca: false,
          justificativa: null,
        },
      });

      if (faltasNaoJustificadas > 2) {
        // DESATIVAR MATRÍCULA
        // await this.prisma.matriculaAtividade.update({
        //   where: { id_matricula: matricula.id_matricula },
        //   data: { status: "INATIVA" },
        // });

        const frequencia = await this.prisma.frequencia.findUnique({
          where: { id_frequencia: novaFrequencia.id_frequencia },
          include: {
            matricula: {
              include: {
                pessoa: true,
              },
            },
          },
        });

        const id_familia = frequencia?.matricula?.pessoa?.id_familia;

        // Regra de negócio: alterar elegibilidade da família
        if (id_familia) {
          await this.prisma.familia.update({
            where: { id_familia: id_familia },
            data: { elegivel_cesta_basica: false },
          });

          this.logger.warn(
            `Família ID ${id_familia} tornou-se inelegível e matrícula ID ${matricula.id_matricula} foi inativada por excesso de faltas.`,
          );
        }
      }
    }

    return novaFrequencia;
  }

  async update(id: bigint, updateFrequenciaDto: UpdateFrequenciaDto) {
    return this.repository.update(id, updateFrequenciaDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByPessoa(id_pessoa: bigint) {
    return this.repository.findByPessoa(id_pessoa);
  }

  async findByAtividade(id_atividade: bigint) {
    return this.repository.findByAtividade(id_atividade);
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date) {
    return this.repository.findByPeriodo(dataInicio, dataFim);
  }

  async findByPresenca(presenca: boolean) {
    return this.repository.findByPresenca(presenca);
  }

  async findByProfile(perfil: string, userId: bigint) {
    if (perfil === "admin") {
      // Admin pode ver todas as frequências
      return this.findAll();
    } else {
      // Usuário comum só pode ver frequências de suas próprias atividades
      // Esta lógica pode ser adaptada conforme necessário
      return this.findAll();
    }
  }

  async generateReport(filter: any) {
    const { id_pessoa, id_atividade, dataInicio, dataFim, presenca } = filter;

    if (id_pessoa) {
      return this.findByPessoa(BigInt(id_pessoa));
    }

    if (id_atividade) {
      return this.findByAtividade(BigInt(id_atividade));
    }

    if (dataInicio && dataFim) {
      return this.findByPeriodo(new Date(dataInicio), new Date(dataFim));
    }

    if (presenca !== undefined) {
      return this.findByPresenca(presenca === "true");
    }

    return this.findAll();
  }
}
