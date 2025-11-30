import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { DoacaoRepository, TipoDoacao } from "./repositories/doacao.repositories";
import { CreateDoacaoDto } from "./dto/create-doacao.dto";
import { UpdateDoacaoDto } from "./dto/update-doacao.dto";
import { SnowflakeService } from "../snowflake/snowflake.service";

/**
 * Serviço de Doações
 * Gerencia a lógica de negócio das doações
 */
@Injectable()
export class DoacaoService {
  constructor(
    private readonly repository: DoacaoRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  /**
   * Cria uma nova doação no sistema
   * Valida se doações monetárias têm valor informado
   */
  async create(createDoacaoDto: CreateDoacaoDto) {
    // Doações em dinheiro precisam ter um valor
    if (createDoacaoDto.tipo === TipoDoacao.monetaria && !createDoacaoDto.valor) {
      throw new BadRequestException("Doações monetárias devem ter um valor informado");
    }

    const id = this.snowflakeService.generate();

    const doacaoData = {
      ...createDoacaoDto,
      id_doacao: id,
    };

    return this.repository.create(doacaoData);
  }

  // Busca todas as doações cadastradas
  async findAll() {
    return this.repository.findAll();
  }

  // Busca uma doação específica pelo ID
  async findOne(id: bigint) {
    const doacao = await this.repository.findOne(id);

    if (!doacao) {
      throw new NotFoundException(`Doação com ID ${id} não encontrada`);
    }

    return doacao;
  }

  // Atualiza os dados de uma doação existente
  async update(id: bigint, updateDoacaoDto: UpdateDoacaoDto) {
    // Primeiro verifica se a doação existe
    await this.findOne(id);

    // Valida novamente se é doação monetária
    if (updateDoacaoDto.tipo === TipoDoacao.monetaria && !updateDoacaoDto.valor) {
      throw new BadRequestException("Doações monetárias devem ter um valor informado");
    }

    return this.repository.update(id, updateDoacaoDto);
  }

  // Remove uma doação do sistema
  async remove(id: bigint) {
    // Verifica se a doação existe antes de remover
    await this.findOne(id);

    return this.repository.remove(id);
  }

  // Busca todas as doações de um parceiro específico
  async findByParceiro(id_parceiro: bigint) {
    return this.repository.findByParceiro(id_parceiro);
  }

  // Busca doações por tipo (monetária ou material)
  async findByTipo(tipo: TipoDoacao) {
    return this.repository.findByTipo(tipo);
  }

  // Busca doações anônimas (sem parceiro identificado)
  async findAnonimas() {
    return this.repository.findAnonimas();
  }

  /**
   * Busca doações em um período específico
   * Valida se as datas são válidas e se estão na ordem correta
   */
  async findByPeriodo(dataInicio: string, dataFim: string) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Verifica se as datas fornecidas são válidas
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException("Datas inválidas fornecidas");
    }

    if (inicio > fim) {
      throw new BadRequestException("Data de início deve ser anterior à data de fim");
    }

    return this.repository.findByPeriodo(inicio, fim);
  }

  async findByPeriodoComTipo(dataInicio: string, dataFim: string, tipo?: TipoDoacao) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Validar datas
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException("Datas inválidas fornecidas");
    }

    if (inicio > fim) {
      throw new BadRequestException("Data de início deve ser anterior à data de fim");
    }

    return this.repository.findByPeriodoComTipo(inicio, fim, tipo);
  }

  async getEstatisticasPorPeriodo(dataInicio: string, dataFim: string) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Validar datas
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException("Datas inválidas fornecidas");
    }

    if (inicio > fim) {
      throw new BadRequestException("Data de início deve ser anterior à data de fim");
    }

    return this.repository.getEstatisticasPorPeriodo(inicio, fim);
  }
}
