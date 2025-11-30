import { Injectable } from "@nestjs/common";
import { ParceiroRepository } from "./repositories/parceiro.repository";
import { CreateParceiroDto } from "./dto/create-parceiro.dto";
import { UpdateParceiroDto } from "./dto/update-parceiro.dto";
import { Prisma, TipoPessoa } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class ParceiroService {
  constructor(
    private readonly repository: ParceiroRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createParceiroDto: CreateParceiroDto) {
    const id = this.snowflakeService.generate();

    const parceiroData: Prisma.ParceiroCreateInput = {
      id_parceiro: id,
      nome: createParceiroDto.nome,
      tipo_pessoa: createParceiroDto.tipo_pessoa,
      documento: createParceiroDto.documento || null,
      email: createParceiroDto.email || null,
      telefone: createParceiroDto.telefone || null,
      endereco: createParceiroDto.endereco || null,
    };

    return this.repository.create(parceiroData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async update(id: bigint, updateParceiroDto: UpdateParceiroDto) {
    return this.repository.update(id, updateParceiroDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByTipoPessoa(tipo_pessoa: TipoPessoa) {
    return this.repository.findByTipoPessoa(tipo_pessoa);
  }

  async findByDocumento(documento: string) {
    return this.repository.findByDocumento(documento);
  }

  async findByNome(nome: string) {
    return this.repository.findByNome(nome);
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date) {
    return this.repository.findByPeriodo(dataInicio, dataFim);
  }

  async findComDoacoes() {
    return this.repository.findComDoacoes();
  }

  async findComServicos() {
    return this.repository.findComServicos();
  }

  async findByProfile(perfil: string) {
    if (perfil === "admin") {
      // Admin pode ver todos os parceiros
      return this.findAll();
    } else {
      // Usuário comum pode ver apenas parceiros com doações ativas
      // (esta é uma regra de exemplo, ajustar conforme necessidade)
      return this.repository.findAll();
    }
  }

  async generateReport(filter: any) {
    const { tipo_pessoa, dataCadastroInicio, dataCadastroFim, nome, comDoacoes, comServicos } = filter;

    if (tipo_pessoa) {
      return this.findByTipoPessoa(tipo_pessoa as TipoPessoa);
    }

    if (dataCadastroInicio && dataCadastroFim) {
      return this.findByPeriodo(new Date(dataCadastroInicio), new Date(dataCadastroFim));
    }

    if (nome) {
      return this.findByNome(nome);
    }

    if (comDoacoes === "true") {
      return this.findComDoacoes();
    }

    if (comServicos === "true") {
      return this.findComServicos();
    }

    return this.findAll();
  }
}
