-- AlterTable
ALTER TABLE "OrganisationAuthenticationPortal" ADD COLUMN     "allowedDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "autoProvision" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "defaultRole" "OrganisationMemberRole" NOT NULL DEFAULT 'MEMBER';
