import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";

import { PrismaService } from "src/prisma/prisma.service";
import { CreateMatriculaAtividadeDto } from "./dto/create-matriculaAtividade.dto";
import { UpdateMatriculaAtividadeDto } from "./dto/update-matriculaAtividade.dto";
import { MatriculaAtividadeRepository } from "./repositories/matriculaAtividade.repository";

@Injectable()
export class MatriculaAtividadeService {
  constructor(
    private readonly repository: MatriculaAtividadeRepository,
    private readonly snowflakeService: SnowflakeService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createDto: CreateMatriculaAtividadeDto) {
    let existingMatricula: any;

    if (createDto.id_pessoa) {
      existingMatricula = await this.prisma.matriculaAtividade.findUnique({
        where: {
          id_pessoa_id_atividade: {
            id_pessoa: BigInt(createDto.id_pessoa),
            id_atividade: BigInt(createDto.id_atividade),
          },
        },
      });
    } else if (createDto.id_crianca) {
      existingMatricula = await this.prisma.matriculaAtividade.findUnique({
        where: {
          id_crianca_id_atividade: {
            id_crianca: BigInt(createDto.id_crianca),
            id_atividade: BigInt(createDto.id_atividade),
          },
        },
      });
    } else {
      throw new ConflictException("É necessário informar id_pessoa ou id_crianca.");
    }

    if (existingMatricula) {
      throw new ConflictException("Já existe matrícula para esta pessoa/criança nesta atividade.");
    }

    const id = this.snowflakeService.generate();
    const data: Prisma.MatriculaAtividadeCreateInput = {
      id_matricula: id,
      status: createDto.status,
      observacoes: createDto.observacoes,
      atividade: { connect: { id_atividade: BigInt(createDto.id_atividade) } },
      ...(createDto.id_pessoa && { pessoa: { connect: { id_pessoa: BigInt(createDto.id_pessoa) } } }),
      ...(createDto.id_crianca && { crianca: { connect: { id_crianca: BigInt(createDto.id_crianca) } } }),
    };

    return this.repository.create(data);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: bigint) {
    return await this.repository.findOne(id);
  }

  async update(id: bigint, updateDto: UpdateMatriculaAtividadeDto) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: bigint) {
    return await this.repository.remove(id);
  }

  async findByPessoa(id_pessoa: bigint) {
    return await this.repository.findByPessoa(id_pessoa);
  }

  async findByAtividade(id_atividade: bigint) {
    return await this.repository.findByAtividade(id_atividade);
  }
}
