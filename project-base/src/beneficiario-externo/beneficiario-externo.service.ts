import { Injectable, NotFoundException } from "@nestjs/common";
import { BeneficiarioExternoRepository } from "./repositories/beneficiario-externo.repository";
import { CreateBeneficiarioExternoDto } from "./dto/create-beneficiario-externo.dto";
import { UpdateBeneficiarioExternoDto } from "./dto/update-beneficiario-externo.dto";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class BeneficiarioExternoService {
  constructor(
    private readonly repository: BeneficiarioExternoRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createBeneficiarioExternoDto: CreateBeneficiarioExternoDto) {
    const id = this.snowflakeService.generate();

    const beneficiarioData = {
      ...createBeneficiarioExternoDto,
      id_beneficiario: id,
    };

    return this.repository.create(beneficiarioData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    const beneficiario = await this.repository.findOne(id);

    if (!beneficiario) {
      throw new NotFoundException(`Beneficiário externo com ID ${id} não encontrado`);
    }

    return beneficiario;
  }

  async update(id: bigint, updateBeneficiarioExternoDto: UpdateBeneficiarioExternoDto) {
    // Verificar se o beneficiário existe
    await this.findOne(id);

    return this.repository.update(id, updateBeneficiarioExternoDto);
  }

  async remove(id: bigint) {
    // Verificar se o beneficiário existe
    await this.findOne(id);

    return this.repository.remove(id);
  }

  async findByNome(nome: string) {
    return this.repository.findByNome(nome);
  }
}
