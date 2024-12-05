/*
  Warnings:

  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Income', 'Expense');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('Salary', 'Food', 'Savings', 'Transportation');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "TransactionCategory" NOT NULL;
