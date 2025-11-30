-- DropForeignKey
ALTER TABLE "Familia" DROP CONSTRAINT "Familia_id_responsavel_fkey";

-- AlterTable
ALTER TABLE "Familia" ALTER COLUMN "id_responsavel" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Familia" ADD CONSTRAINT "Familia_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "Responsavel"("id_responsavel") ON DELETE SET NULL ON UPDATE CASCADE;
