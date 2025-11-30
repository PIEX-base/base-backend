/*
  Warnings:

  - Changed the type of `horario_inicio` on the `Atividade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `horario_fim` on the `Atividade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Atividade" ALTER COLUMN "id_atividade" DROP DEFAULT,
DROP COLUMN "horario_inicio",
ADD COLUMN     "horario_inicio" TIMESTAMP(3) NOT NULL,
DROP COLUMN "horario_fim",
ADD COLUMN     "horario_fim" TIMESTAMP(3) NOT NULL;
DROP SEQUENCE "Atividade_id_atividade_seq";

-- AlterTable
ALTER TABLE "AtividadeVoluntario" ALTER COLUMN "id_atividade" DROP DEFAULT;
DROP SEQUENCE "AtividadeVoluntario_id_atividade_seq";

-- AlterTable
ALTER TABLE "BeneficiarioExterno" ALTER COLUMN "id_beneficiario" DROP DEFAULT;
DROP SEQUENCE "BeneficiarioExterno_id_beneficiario_seq";

-- AlterTable
ALTER TABLE "CestaBasica" ALTER COLUMN "id_cesta" DROP DEFAULT;
DROP SEQUENCE "cestabasica_id_cesta_seq";

-- AlterTable
ALTER TABLE "Doacao" ALTER COLUMN "id_doacao" DROP DEFAULT;
DROP SEQUENCE "Doacao_id_doacao_seq";

-- AlterTable
ALTER TABLE "Familia" ALTER COLUMN "id_familia" DROP DEFAULT;
DROP SEQUENCE "Familia_id_familia_seq";

-- AlterTable
ALTER TABLE "Frequencia" ALTER COLUMN "id_frequencia" DROP DEFAULT;
DROP SEQUENCE "frequencia_id_frequencia_seq";

-- AlterTable
ALTER TABLE "ItemDoado" ALTER COLUMN "id_item" DROP DEFAULT;
DROP SEQUENCE "ItemDoado_id_item_seq";

-- AlterTable
ALTER TABLE "Materia" ALTER COLUMN "id_materia" DROP DEFAULT;
DROP SEQUENCE "Materia_id_materia_seq";

-- AlterTable
ALTER TABLE "Parceiro" ALTER COLUMN "id_parceiro" DROP DEFAULT;
DROP SEQUENCE "parceiro_id_parceiro_seq";

-- AlterTable
ALTER TABLE "Pessoa" ALTER COLUMN "id_pessoa" DROP DEFAULT;
DROP SEQUENCE "Pessoa_id_pessoa_seq";

-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "id_produto" DROP DEFAULT;
DROP SEQUENCE "Produto_id_produto_seq";

-- AlterTable
ALTER TABLE "ProdutoCesta" ALTER COLUMN "id_produto_cesta" DROP DEFAULT;
DROP SEQUENCE "ProdutoCesta_id_produto_cesta_seq";

-- AlterTable
ALTER TABLE "Responsavel" ALTER COLUMN "id_responsavel" DROP DEFAULT;
DROP SEQUENCE "responsavel_id_responsavel_seq";

-- AlterTable
ALTER TABLE "ServicoPrestado" ALTER COLUMN "id_servico" DROP DEFAULT;
DROP SEQUENCE "ServicoPrestado_id_servico_seq";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "id_usuario" DROP DEFAULT;
DROP SEQUENCE "usuario_id_usuario_seq";

-- AlterTable
ALTER TABLE "Voluntario" ALTER COLUMN "id_voluntario" DROP DEFAULT;
DROP SEQUENCE "voluntario_id_voluntario_seq";
