-- CreateEnum
CREATE TYPE "Age" AS ENUM ('Filhote', 'Adulto', 'Idoso');

-- CreateEnum
CREATE TYPE "AnimalSize" AS ENUM ('Pequeno', 'Medio', 'Grande');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('Muito Baixa', 'Baixa', 'Média', 'Alta', 'Muito Alta');

-- CreateEnum
CREATE TYPE "LevelOfIndependence" AS ENUM ('Baixa', 'Media', 'Alta');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('Pequeno', 'Medio', 'Grande');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" "Age" NOT NULL,
    "size" "AnimalSize" NOT NULL,
    "level_independence" "LevelOfIndependence" NOT NULL,
    "environment" "Environment" NOT NULL,
    "donation_requirements" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ong_id" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_ong_id_fkey" FOREIGN KEY ("ong_id") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
