import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CestaBasicaRepository } from "./repositories/cestabasica.repository";
import { CreateCestaBasicaDto } from "./dto/create-cestabasica.dto";
import { UpdateCestaBasicaDto } from "./dto/update-cestabasica.dto";
import { Prisma, TipoAtividade } from "@prisma/client";
import { SnowflakeService } from "src/snowflake/snowflake.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CriancaEntity } from "src/crianca/entity/crianca.entity";

/**
 * Serviço de Cestas Básicas
 * Gerencia a lógica de negócio da distribuição de cestas básicas
 */
@Injectable()
export class CestaBasicaService {
  constructor(
    private readonly repository: CestaBasicaRepository,
    private readonly snowflakeService: SnowflakeService,
    private readonly prisma: PrismaService,
  ) {}

  // Busca todas as cestas básicas entregues
  async findAll() {
    return this.repository.findAll();
  }

  // Busca uma cesta básica específica pelo ID
  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  /**
   * Registra uma nova entrega de cesta básica
   * Conecta a cesta ao responsável pela família
   */
  async create(createCestaBasicaDto: CreateCestaBasicaDto) {
    // Gera um ID único para a cesta
    const id = this.snowflakeService.generate();
    const { produtos, ...cestaData } = createCestaBasicaDto;

    // Prepara os dados para criação
    const cestaBasicaData: Prisma.CestaBasicaCreateInput = {
      id_cesta: id,
      data_entrega: cestaData.data_entrega,
      observacoes: cestaData.observacoes || null,
    };

    // Adiciona relações conforme os dados informados
    if (cestaData.id_responsavel) {
      cestaBasicaData.responsavel = {
        connect: {
          id_responsavel: BigInt(cestaData.id_responsavel),
        },
      };
    }

    if (cestaData.id_beneficiario) {
      cestaBasicaData.beneficiario_externo = {
        connect: {
          id_beneficiario: BigInt(cestaData.id_beneficiario),
        },
      };
    }

    if (cestaData.id_doacao) {
      cestaBasicaData.doacao_origem = {
        connect: {
          id_doacao: BigInt(cestaData.id_doacao),
        },
      };
    }

    return this.repository.create(cestaBasicaData, produtos);
  }

  // Atualiza os dados de uma entrega de cesta básica
  async update(id: bigint, updateCestaBasicaDto: UpdateCestaBasicaDto) {
    return this.repository.update(id, updateCestaBasicaDto);
  }

  // Remove o registro de uma entrega de cesta básica
  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  /**
   * Busca cestas básicas de acordo com o perfil do usuário
   * Admin vê todas, outros perfis podem ter filtros específicos
   */
  async findByProfile(perfil: string) {
    if (perfil === "admin") {
      // Admin pode ver todas as cestas
      return this.findAll();
    } else {
      // Usuário comum só pode ver suas próprias cestas
      return this.findByResponsavel(userId);
    }
  }

  /**
   * Gera relatórios de entregas de cestas básicas
   * Pode filtrar por data de entrega e quantidade
   */
  async generateReport(filter: any) {
    const { data_entrega, quantidade } = filter;
    const whereConditions: any = {};
    if (data_entrega) {
      whereConditions.data_entrega = {
        gte: new Date(data_entrega), // Busca entregas a partir desta data
      };
    }
    if (quantidade) {
      whereConditions.quantidade = quantidade; // Busca pela quantidade específica
    }

    if (idBeneficiario) {
      return this.findByBeneficiario(BigInt(idBeneficiario));
    }

    if (idDoacao) {
      return this.findByDoacao(BigInt(idDoacao));
    }

    return this.findAll();
  }
}
