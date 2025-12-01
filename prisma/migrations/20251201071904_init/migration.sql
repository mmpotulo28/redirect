-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Click" (
    "id" TEXT NOT NULL,
    "redirectId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ip" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_shortCode_key" ON "Redirect"("shortCode");

-- CreateIndex
CREATE INDEX "Redirect_userId_idx" ON "Redirect"("userId");

-- CreateIndex
CREATE INDEX "Click_redirectId_idx" ON "Click"("redirectId");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_redirectId_fkey" FOREIGN KEY ("redirectId") REFERENCES "Redirect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
