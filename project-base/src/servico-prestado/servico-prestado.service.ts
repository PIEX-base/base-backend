import { Injectable } from "@nestjs/common";
import { ServicoPrestadoRepository } from "./repositories/servico-prestado.repository";
import { CreateServicoPrestadoDto } from "./dto/create-servico-prestado.dto";
import { UpdateServicoPrestadoDto } from "./dto/update-servico-prestado.dto";
import { Prisma } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class ServicoPrestadoService {
  constructor(
    private readonly repository: ServicoPrestadoRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createServicoPrestadoDto: CreateServicoPrestadoDto) {
    const id = this.snowflakeService.generate();

    const servicoPrestadoData: Prisma.ServicoPrestadoCreateInput = {
      id_servico: id,
      descricao: createServicoPrestadoDto.descricao,
      data_inicio: createServicoPrestadoDto.data_inicio,
      data_fim: createServicoPrestadoDto.data_fim || null,
      observacoes: createServicoPrestadoDto.observacoes || null,
      parceiro: {
        connect: {
          id_parceiro: BigInt(createServicoPrestadoDto.id_parceiro),
        },
      },
    };

    return this.repository.create(servicoPrestadoData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async update(id: bigint, updateServicoPrestadoDto: UpdateServicoPrestadoDto) {
    return this.repository.update(id, updateServicoPrestadoDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByParceiro(id_parceiro: bigint) {
    return this.repository.findByParceiro(id_parceiro);
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date) {
    return this.repository.findByPeriodo(dataInicio, dataFim);
  }

  async findServicosEmAndamento() {
    return this.repository.findServicosEmAndamento();
  }

  async findByDescricao(descricao: string) {
    return this.repository.findByDescricao(descricao);
  }

  async findByProfile(perfil: string) {
    if (perfil === "admin") {
      // Admin pode ver todos os serviços prestados
      return this.findAll();
    } else {
      // Usuário comum pode ter acesso limitado ou diferenciado
      // Neste exemplo, retornamos apenas serviços em andamento
      return this.findServicosEmAndamento();
    }
  }

  async generateReport(filter: any) {
    const { id_parceiro, dataInicio, dataFim, descricao, emAndamento } = filter;

    if (id_parceiro) {
      return this.findByParceiro(BigInt(id_parceiro));
    }

    if (dataInicio && dataFim) {
      return this.findByPeriodo(new Date(dataInicio), new Date(dataFim));
    }

    if (descricao) {
      return this.findByDescricao(descricao);
    }

    if (emAndamento === "true") {
      return this.findServicosEmAndamento();
    }

    return this.findAll();
  }

  async finalizarServico(id: bigint, dataFim: Date) {
    const servico = await this.findOne(id);

    if (servico.data_fim) {
      throw new Error("Este serviço já foi finalizado.");
    }

    return this.update(id, { data_fim: dataFim });
  }
}
