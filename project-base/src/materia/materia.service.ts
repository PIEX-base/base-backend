import { Injectable } from "@nestjs/common";
import { MateriaRepository } from "./repositories/materia.repository";
import { CreateMateriaDto } from "./dto/create-materia.dto";
import { UpdateMateriaDto } from "./dto/update-materia.dto";
import { Prisma } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class MateriaService {
  constructor(
    private readonly repository: MateriaRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createMateriaDto: CreateMateriaDto) {
    const id = this.snowflakeService.generate();

    const materiaData: Prisma.MateriaCreateInput = {
      id_materia: id,
      nome: createMateriaDto.nome,
      descricao: createMateriaDto.descricao || null,
      atividade: {
        connect: {
          id_atividade: BigInt(createMateriaDto.id_atividade),
        },
      },
    };

    return this.repository.create(materiaData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async update(id: bigint, updateMateriaDto: UpdateMateriaDto) {
    return this.repository.update(id, updateMateriaDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByAtividade(id_atividade: bigint) {
    return this.repository.findByAtividade(id_atividade);
  }

  async findByNome(nome: string) {
    return this.repository.findByNome(nome);
  }

  async findByTipoAtividade(tipo: string) {
    return this.repository.findByTipoAtividade(tipo);
  }

  async findByProfile(perfil: string) {
    if (perfil === "admin") {
      // Admin pode ver todas as matérias
      return this.findAll();
    } else {
      // Usuários normais também podem ver todas as matérias
      // Se houver restrição específica, pode ser implementada aqui
      return this.findAll();
    }
  }

  async generateReport(filter: any) {
    const { id_atividade, nome, tipo } = filter;

    if (id_atividade) {
      return this.findByAtividade(BigInt(id_atividade));
    }

    if (nome) {
      return this.findByNome(nome);
    }

    if (tipo) {
      return this.findByTipoAtividade(tipo);
    }

    return this.findAll();
  }
}
