/*
  Warnings:

  - You are about to drop the column `id_atividade` on the `Frequencia` table. All the data in the column will be lost.
  - You are about to drop the column `id_pessoa` on the `Frequencia` table. All the data in the column will be lost.
  - Added the required column `id_matricula` to the `Frequencia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusMatricula" AS ENUM ('ATIVA', 'INATIVA', 'CONCLUIDA');

-- DropForeignKey
ALTER TABLE "Frequencia" DROP CONSTRAINT "Frequencia_id_atividade_fkey";

-- DropForeignKey
ALTER TABLE "Frequencia" DROP CONSTRAINT "Frequencia_id_pessoa_fkey";

-- AlterTable
ALTER TABLE "Frequencia" DROP COLUMN "id_atividade",
DROP COLUMN "id_pessoa",
ADD COLUMN     "id_matricula" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "MatriculaAtividade" (
    "id_matricula" BIGINT NOT NULL,
    "id_pessoa" BIGINT NOT NULL,
    "id_atividade" BIGINT NOT NULL,
    "data_matricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusMatricula" NOT NULL DEFAULT 'ATIVA',
    "observacoes" TEXT,

    CONSTRAINT "MatriculaAtividade_pkey" PRIMARY KEY ("id_matricula")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatriculaAtividade_id_pessoa_id_atividade_key" ON "MatriculaAtividade"("id_pessoa", "id_atividade");

-- AddForeignKey
ALTER TABLE "MatriculaAtividade" ADD CONSTRAINT "MatriculaAtividade_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "Pessoa"("id_pessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatriculaAtividade" ADD CONSTRAINT "MatriculaAtividade_id_atividade_fkey" FOREIGN KEY ("id_atividade") REFERENCES "Atividade"("id_atividade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frequencia" ADD CONSTRAINT "Frequencia_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "MatriculaAtividade"("id_matricula") ON DELETE RESTRICT ON UPDATE CASCADE;
