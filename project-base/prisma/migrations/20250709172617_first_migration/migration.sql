/*
  Warnings:

  - You are about to drop the column `quantidade` on the `CestaBasica` table. All the data in the column will be lost.
  - You are about to drop the column `atividade` on the `Frequencia` table. All the data in the column will be lost.
  - You are about to drop the column `id_crianca` on the `Frequencia` table. All the data in the column will be lost.
  - You are about to drop the column `contribuicao` on the `Parceiro` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Parceiro` table. All the data in the column will be lost.
  - You are about to drop the column `parentesco_com_crianca` on the `Responsavel` table. All the data in the column will be lost.
  - You are about to drop the `Crianca` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_atividade` to the `Frequencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pessoa` to the `Frequencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_pessoa` to the `Parceiro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_nascimento` to the `Responsavel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Voluntario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `Voluntario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('fisica', 'juridica');

-- CreateEnum
CREATE TYPE "TipoDoacao" AS ENUM ('monetaria', 'material');

-- CreateEnum
CREATE TYPE "TipoAtividade" AS ENUM ('roda_terapeutica', 'jiu_jitsu', 'aula_reforco', 'psicopedagogia', 'alfabetizacao_adultos', 'aula_musica', 'outra');

-- DropForeignKey
ALTER TABLE "CestaBasica" DROP CONSTRAINT "CestaBasica_id_responsavel_fkey";

-- DropForeignKey
ALTER TABLE "Crianca" DROP CONSTRAINT "Crianca_id_responsavel_fkey";

-- DropForeignKey
ALTER TABLE "Frequencia" DROP CONSTRAINT "Frequencia_id_crianca_fkey";

-- AlterTable
CREATE SEQUENCE cestabasica_id_cesta_seq;
ALTER TABLE "CestaBasica" DROP COLUMN "quantidade",
ADD COLUMN     "id_beneficiario" BIGINT,
ADD COLUMN     "id_doacao" BIGINT,
ALTER COLUMN "id_cesta" SET DEFAULT nextval('cestabasica_id_cesta_seq'),
ALTER COLUMN "id_responsavel" DROP NOT NULL,
ALTER COLUMN "observacoes" DROP NOT NULL;
ALTER SEQUENCE cestabasica_id_cesta_seq OWNED BY "CestaBasica"."id_cesta";

-- AlterTable
CREATE SEQUENCE frequencia_id_frequencia_seq;
ALTER TABLE "Frequencia" DROP COLUMN "atividade",
DROP COLUMN "id_crianca",
ADD COLUMN     "id_atividade" BIGINT NOT NULL,
ADD COLUMN     "id_pessoa" BIGINT NOT NULL,
ADD COLUMN     "justificativa" TEXT,
ALTER COLUMN "id_frequencia" SET DEFAULT nextval('frequencia_id_frequencia_seq');
ALTER SEQUENCE frequencia_id_frequencia_seq OWNED BY "Frequencia"."id_frequencia";

-- AlterTable
CREATE SEQUENCE parceiro_id_parceiro_seq;
ALTER TABLE "Parceiro" DROP COLUMN "contribuicao",
DROP COLUMN "tipo",
ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documento" TEXT,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "tipo_pessoa" "TipoPessoa" NOT NULL,
ALTER COLUMN "id_parceiro" SET DEFAULT nextval('parceiro_id_parceiro_seq'),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "telefone" DROP NOT NULL;
ALTER SEQUENCE parceiro_id_parceiro_seq OWNED BY "Parceiro"."id_parceiro";

-- AlterTable
CREATE SEQUENCE responsavel_id_responsavel_seq;
ALTER TABLE "Responsavel" DROP COLUMN "parentesco_com_crianca",
ADD COLUMN     "data_nascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "foto_url" TEXT,
ALTER COLUMN "id_responsavel" SET DEFAULT nextval('responsavel_id_responsavel_seq'),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "ocupacao" DROP NOT NULL;
ALTER SEQUENCE responsavel_id_responsavel_seq OWNED BY "Responsavel"."id_responsavel";

-- AlterTable
CREATE SEQUENCE usuario_id_usuario_seq;
ALTER TABLE "Usuario" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_usuario" SET DEFAULT nextval('usuario_id_usuario_seq');
ALTER SEQUENCE usuario_id_usuario_seq OWNED BY "Usuario"."id_usuario";

-- AlterTable
CREATE SEQUENCE voluntario_id_voluntario_seq;
ALTER TABLE "Voluntario" ADD COLUMN     "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "rg" TEXT NOT NULL,
ADD COLUMN     "tem_antecedentes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "url_comprovante" TEXT,
ALTER COLUMN "id_voluntario" SET DEFAULT nextval('voluntario_id_voluntario_seq'),
ALTER COLUMN "respondeu_questionario" SET DEFAULT false,
ALTER COLUMN "aceitou_termos" SET DEFAULT false;
ALTER SEQUENCE voluntario_id_voluntario_seq OWNED BY "Voluntario"."id_voluntario";

-- DropTable
DROP TABLE "Crianca";

-- CreateTable
CREATE TABLE "Familia" (
    "id_familia" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "numero_dependentes" INTEGER NOT NULL,
    "id_responsavel" BIGINT NOT NULL,
    "observacoes" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id_familia")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "id_pessoa" BIGSERIAL NOT NULL,
    "id_familia" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "rg" TEXT,
    "cpf" TEXT,
    "foto_url" TEXT,
    "observacoes" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id_pessoa")
);

-- CreateTable
CREATE TABLE "BeneficiarioExterno" (
    "id_beneficiario" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "origem" TEXT NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "BeneficiarioExterno_pkey" PRIMARY KEY ("id_beneficiario")
);

-- CreateTable
CREATE TABLE "AtividadeVoluntario" (
    "id_atividade" BIGSERIAL NOT NULL,
    "id_voluntario" BIGINT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_realizacao" TIMESTAMP(3) NOT NULL,
    "horas_trabalhadas" DOUBLE PRECISION NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "AtividadeVoluntario_pkey" PRIMARY KEY ("id_atividade")
);

-- CreateTable
CREATE TABLE "ServicoPrestado" (
    "id_servico" BIGSERIAL NOT NULL,
    "id_parceiro" BIGINT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "observacoes" TEXT,

    CONSTRAINT "ServicoPrestado_pkey" PRIMARY KEY ("id_servico")
);

-- CreateTable
CREATE TABLE "Doacao" (
    "id_doacao" BIGSERIAL NOT NULL,
    "id_parceiro" BIGINT,
    "tipo" "TipoDoacao" NOT NULL,
    "valor" DECIMAL(65,30),
    "descricao" TEXT NOT NULL,
    "data_recebimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comprovante_url" TEXT,
    "is_anonima" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("id_doacao")
);

-- CreateTable
CREATE TABLE "ItemDoado" (
    "id_item" BIGSERIAL NOT NULL,
    "id_doacao" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "unidade_medida" TEXT,

    CONSTRAINT "ItemDoado_pkey" PRIMARY KEY ("id_item")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id_produto" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "is_basico" BOOLEAN NOT NULL DEFAULT true,
    "unidade_medida" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "ProdutoCesta" (
    "id_produto_cesta" BIGSERIAL NOT NULL,
    "id_cesta" BIGINT NOT NULL,
    "id_produto" BIGINT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "ProdutoCesta_pkey" PRIMARY KEY ("id_produto_cesta")
);

-- CreateTable
CREATE TABLE "Atividade" (
    "id_atividade" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoAtividade" NOT NULL,
    "publico_alvo" TEXT NOT NULL,
    "dias_semana" TEXT NOT NULL,
    "horario_inicio" TEXT NOT NULL,
    "horario_fim" TEXT NOT NULL,

    CONSTRAINT "Atividade_pkey" PRIMARY KEY ("id_atividade")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id_materia" BIGSERIAL NOT NULL,
    "id_atividade" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id_materia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Familia_id_responsavel_key" ON "Familia"("id_responsavel");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"("cpf");

-- AddForeignKey
ALTER TABLE "Familia" ADD CONSTRAINT "Familia_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "Responsavel"("id_responsavel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "Familia"("id_familia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeVoluntario" ADD CONSTRAINT "AtividadeVoluntario_id_voluntario_fkey" FOREIGN KEY ("id_voluntario") REFERENCES "Voluntario"("id_voluntario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoPrestado" ADD CONSTRAINT "ServicoPrestado_id_parceiro_fkey" FOREIGN KEY ("id_parceiro") REFERENCES "Parceiro"("id_parceiro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_id_parceiro_fkey" FOREIGN KEY ("id_parceiro") REFERENCES "Parceiro"("id_parceiro") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemDoado" ADD CONSTRAINT "ItemDoado_id_doacao_fkey" FOREIGN KEY ("id_doacao") REFERENCES "Doacao"("id_doacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CestaBasica" ADD CONSTRAINT "CestaBasica_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "Responsavel"("id_responsavel") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CestaBasica" ADD CONSTRAINT "CestaBasica_id_beneficiario_fkey" FOREIGN KEY ("id_beneficiario") REFERENCES "BeneficiarioExterno"("id_beneficiario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CestaBasica" ADD CONSTRAINT "CestaBasica_id_doacao_fkey" FOREIGN KEY ("id_doacao") REFERENCES "Doacao"("id_doacao") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoCesta" ADD CONSTRAINT "ProdutoCesta_id_cesta_fkey" FOREIGN KEY ("id_cesta") REFERENCES "CestaBasica"("id_cesta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoCesta" ADD CONSTRAINT "ProdutoCesta_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_id_atividade_fkey" FOREIGN KEY ("id_atividade") REFERENCES "Atividade"("id_atividade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frequencia" ADD CONSTRAINT "Frequencia_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa"("id_pessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frequencia" ADD CONSTRAINT "Frequencia_id_atividade_fkey" FOREIGN KEY ("id_atividade") REFERENCES "Atividade"("id_atividade") ON DELETE RESTRICT ON UPDATE CASCADE;
