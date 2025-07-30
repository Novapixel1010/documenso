/*
  Warnings:

  - A unique constraint covering the columns `[organisationAuthenticationPortalId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.
*/
-- CreateTable
CREATE TABLE "OrganisationAuthenticationPortal" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT NOT NULL DEFAULT '',
    "clientSecret" TEXT NOT NULL DEFAULT '',
    "wellKnownUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "OrganisationAuthenticationPortal_pkey" PRIMARY KEY ("id")
);

-- Create a temporary table to store organisation IDs and their corresponding auth portal IDs
CREATE TEMP TABLE temp_org_auth_mapping AS
SELECT
    "Organisation"."id" as org_id,
    gen_random_uuid()::text as auth_portal_id
FROM "Organisation";

-- Create default authentication portals for all existing organisations
INSERT INTO "OrganisationAuthenticationPortal" ("id", "enabled", "clientId", "clientSecret", "wellKnownUrl")
SELECT
    temp_org_auth_mapping.auth_portal_id,
    false,
    '',
    '',
    ''
FROM temp_org_auth_mapping;

-- AlterTable - Add the column as nullable first
ALTER TABLE "Organisation" ADD COLUMN "organisationAuthenticationPortalId" TEXT;

-- Update organisations to reference their corresponding default authentication portals
UPDATE "Organisation"
SET "organisationAuthenticationPortalId" = temp_org_auth_mapping.auth_portal_id
FROM temp_org_auth_mapping
WHERE "Organisation"."id" = temp_org_auth_mapping.org_id;

-- Drop the temporary table
DROP TABLE temp_org_auth_mapping;

-- Now make the column NOT NULL after all values are populated
ALTER TABLE "Organisation" ALTER COLUMN "organisationAuthenticationPortalId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_organisationAuthenticationPortalId_key" ON "Organisation"("organisationAuthenticationPortalId");

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_organisationAuthenticationPortalId_fkey" FOREIGN KEY ("organisationAuthenticationPortalId") REFERENCES "OrganisationAuthenticationPortal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
