-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'DRAFT');

-- CreateEnum
CREATE TYPE "TestDriveStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'FOLLOW_UP', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SellRequestStatus" AS ENUM ('PENDING', 'INSPECTION_SCHEDULED', 'EVALUATED', 'OFFER_MADE', 'ACCEPTED', 'REJECTED', 'CLOSED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "kilometers" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "estimatedEmi" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "rto" TEXT NOT NULL,
    "ownership" TEXT NOT NULL,
    "insurance" TEXT NOT NULL,
    "safetyRating" INTEGER NOT NULL,
    "mileage" TEXT NOT NULL,
    "enginePower" TEXT NOT NULL,
    "bootSpace" TEXT NOT NULL,
    "groundClearance" TEXT NOT NULL,
    "inspectionScore" INTEGER NOT NULL,
    "certified" BOOLEAN NOT NULL DEFAULT true,
    "warranty" TEXT NOT NULL DEFAULT '1-Year Comprehensive Pan-India Warranty',
    "color" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT 'Certified Hub Selection',
    "description" TEXT NOT NULL DEFAULT '',
    "status" "CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarImage" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarFeature" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,

    CONSTRAINT "CarFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestDriveBooking" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'doorstep',
    "date" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" "TestDriveStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestDriveBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "carId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellCarRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "carBrand" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "kilometers" INTEGER NOT NULL,
    "expectedPrice" DOUBLE PRECISION,
    "city" TEXT NOT NULL,
    "message" TEXT,
    "status" "SellRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellCarRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Car_stockId_key" ON "Car"("stockId");
CREATE INDEX "Car_brand_model_idx" ON "Car"("brand", "model");
CREATE INDEX "Car_status_idx" ON "Car"("status");
CREATE INDEX "Car_price_idx" ON "Car"("price");
CREATE INDEX "Car_city_idx" ON "Car"("city");
CREATE INDEX "Car_bodyType_idx" ON "Car"("bodyType");
CREATE INDEX "Car_fuelType_idx" ON "Car"("fuelType");

-- CreateIndex
CREATE INDEX "CarImage_carId_idx" ON "CarImage"("carId");
CREATE INDEX "CarImage_carId_sortOrder_idx" ON "CarImage"("carId", "sortOrder");

-- CreateIndex
CREATE INDEX "CarFeature_carId_idx" ON "CarFeature"("carId");

-- CreateIndex
CREATE INDEX "TestDriveBooking_carId_idx" ON "TestDriveBooking"("carId");
CREATE INDEX "TestDriveBooking_status_idx" ON "TestDriveBooking"("status");
CREATE INDEX "TestDriveBooking_createdAt_idx" ON "TestDriveBooking"("createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_carId_idx" ON "Enquiry"("carId");
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- CreateIndex
CREATE INDEX "SellCarRequest_status_idx" ON "SellCarRequest"("status");
CREATE INDEX "SellCarRequest_createdAt_idx" ON "SellCarRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "CarImage" ADD CONSTRAINT "CarImage_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarFeature" ADD CONSTRAINT "CarFeature_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDriveBooking" ADD CONSTRAINT "TestDriveBooking_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
