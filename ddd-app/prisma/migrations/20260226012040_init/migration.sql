-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "ipHash" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_sessions" (
    "id" SERIAL NOT NULL,
    "visitorId" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "lastPage" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "visitor_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_runs" (
    "id" SERIAL NOT NULL,
    "runDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suiteName" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "passed" INTEGER NOT NULL,
    "failed" INTEGER NOT NULL,
    "skipped" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'production',

    CONSTRAINT "test_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_sessions_visitorId_key" ON "visitor_sessions"("visitorId");
