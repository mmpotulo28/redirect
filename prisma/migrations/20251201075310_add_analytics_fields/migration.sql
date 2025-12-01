-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "device" TEXT,
ADD COLUMN     "os" TEXT;

-- AlterTable
ALTER TABLE "Redirect" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT;
