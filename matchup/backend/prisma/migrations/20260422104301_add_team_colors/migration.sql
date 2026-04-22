-- CreateTable
CREATE TABLE "TeamColors" (
    "id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "primary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "club_colors" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamColors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamColors_team_name_key" ON "TeamColors"("team_name");
