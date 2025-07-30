/*
  Warnings:

  - You are about to drop the column `autoProvision` on the `OrganisationAuthenticationPortal` table. All the data in the column will be lost.
  - You are about to drop the column `defaultRole` on the `OrganisationAuthenticationPortal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganisationAuthenticationPortal" DROP COLUMN "autoProvision",
DROP COLUMN "defaultRole",
ADD COLUMN     "autoProvisionUsers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "defaultOrganisationRole" "OrganisationMemberRole" NOT NULL DEFAULT 'MEMBER';
