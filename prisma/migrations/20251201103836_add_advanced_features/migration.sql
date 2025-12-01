-- AlterTable
ALTER TABLE "Redirect" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "startsAt" TIMESTAMP(3);
