-- CreateTable
CREATE TABLE "instructor" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" VARCHAR(100),

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20),
    "cohort" VARCHAR(100),
    "instructorId" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instructor_username_key" ON "instructor"("username");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
