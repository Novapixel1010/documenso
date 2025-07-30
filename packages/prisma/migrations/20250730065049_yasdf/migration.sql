-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserSecurityAuditLogType" ADD VALUE 'ACCOUNT_SSO_UNLINK';
ALTER TYPE "UserSecurityAuditLogType" ADD VALUE 'ORGANISATION_SSO_UNLINK';

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
