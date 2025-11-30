import { Injectable } from "@nestjs/common";
import { AtividadeVoluntarioRepository } from "./repositories/atividade-voluntario.repository";
import { CreateAtividadeVoluntarioDto } from "./dto/create-atividade-voluntario.dto";
import { UpdateAtividadeVoluntarioDto } from "./dto/update-atividade-voluntario.dto";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class AtividadeVoluntarioService {
  constructor(
    private readonly repository: AtividadeVoluntarioRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createAtividadeVoluntarioDto: CreateAtividadeVoluntarioDto) {
    const id = this.snowflakeService.generate();

    const atividadeData = {
      ...createAtividadeVoluntarioDto,
      id_atividade: id,
    };

    return this.repository.create(atividadeData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async update(id: bigint, updateAtividadeVoluntarioDto: UpdateAtividadeVoluntarioDto) {
    return this.repository.update(id, updateAtividadeVoluntarioDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByVoluntario(id_voluntario: bigint) {
    return this.repository.findByVoluntario(id_voluntario);
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date) {
    return this.repository.findByPeriodo(dataInicio, dataFim);
  }
}
