/*
  Warnings:

  - A unique constraint covering the columns `[id_crianca,id_atividade]` on the table `MatriculaAtividade` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MatriculaAtividade" DROP CONSTRAINT "MatriculaAtividade_id_pessoa_fkey";

-- AlterTable
ALTER TABLE "MatriculaAtividade" ADD COLUMN     "id_crianca" BIGINT,
ALTER COLUMN "id_pessoa" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Crianca" (
    "id_crianca" BIGINT NOT NULL,
    "id_familia" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "rg" TEXT,
    "cpf" TEXT,
    "foto_url" TEXT,
    "observacoes" TEXT,
    "matriculada_escola" BOOLEAN NOT NULL DEFAULT false,
    "nome_escola" TEXT,

    CONSTRAINT "Crianca_pkey" PRIMARY KEY ("id_crianca")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crianca_cpf_key" ON "Crianca"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "MatriculaAtividade_id_crianca_id_atividade_key" ON "MatriculaAtividade"("id_crianca", "id_atividade");

-- AddForeignKey
ALTER TABLE "Crianca" ADD CONSTRAINT "Crianca_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "Familia"("id_familia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatriculaAtividade" ADD CONSTRAINT "MatriculaAtividade_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa"("id_pessoa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatriculaAtividade" ADD CONSTRAINT "MatriculaAtividade_id_crianca_fkey" FOREIGN KEY ("id_crianca") REFERENCES "Crianca"("id_crianca") ON DELETE SET NULL ON UPDATE CASCADE;
