-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastCalendarSync" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "LocalEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleEventId" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "lastLocalEdit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastGoogleEdit" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LocalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalEvent_googleEventId_key" ON "LocalEvent"("googleEventId");

-- AddForeignKey
ALTER TABLE "LocalEvent" ADD CONSTRAINT "LocalEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
