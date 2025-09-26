-- CreateEnum
CREATE TYPE "public"."ReportSource" AS ENUM ('CARFAX', 'AUTOCHECK');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "phone" TEXT,
    "bio" TEXT,
    "address" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "auctionAccessNumber" TEXT,
    "auctionAccessQRFileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "photoFileId" TEXT,
    "birthDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Action" (
    "id" TEXT NOT NULL,
    "userMail" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usage_aggregate" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_aggregate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketPriceAnalysisResult" (
    "id" SERIAL NOT NULL,
    "average" INTEGER NOT NULL,
    "below" INTEGER NOT NULL,
    "above" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "distribution" JSONB NOT NULL,

    CONSTRAINT "MarketPriceAnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CarReport" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "source" "public"."ReportSource" NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SalvageInfo" (
    "id" SERIAL NOT NULL,
    "vin" TEXT NOT NULL,
    "salvageWasFound" BOOLEAN NOT NULL,

    CONSTRAINT "SalvageInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VinCheckResult" (
    "id" SERIAL NOT NULL,
    "ABS" TEXT,
    "ActiveSafetySysNote" TEXT,
    "AdaptiveCruiseControl" TEXT,
    "AdaptiveDrivingBeam" TEXT,
    "AdaptiveHeadlights" TEXT,
    "AdditionalErrorText" TEXT,
    "AirBagLocCurtain" TEXT,
    "AirBagLocFront" TEXT,
    "AirBagLocKnee" TEXT,
    "AirBagLocSeatCushion" TEXT,
    "AirBagLocSide" TEXT,
    "AutoReverseSystem" TEXT,
    "AutomaticPedestrianAlertingSound" TEXT,
    "AxleConfiguration" TEXT,
    "Axles" TEXT,
    "BasePrice" TEXT,
    "BatteryA" TEXT,
    "BatteryA_to" TEXT,
    "BatteryCells" TEXT,
    "BatteryInfo" TEXT,
    "BatteryKWh" TEXT,
    "BatteryKWh_to" TEXT,
    "BatteryModules" TEXT,
    "BatteryPacks" TEXT,
    "BatteryType" TEXT,
    "BatteryV" TEXT,
    "BatteryV_to" TEXT,
    "BedLengthIN" TEXT,
    "BedType" TEXT,
    "BlindSpotIntervention" TEXT,
    "BlindSpotMon" TEXT,
    "BodyCabType" TEXT,
    "BodyClass" TEXT,
    "BrakeSystemDesc" TEXT,
    "BrakeSystemType" TEXT,
    "BusFloorConfigType" TEXT,
    "BusLength" TEXT,
    "BusType" TEXT,
    "CAN_AACN" TEXT,
    "CIB" TEXT,
    "CashForClunkers" TEXT,
    "ChargerLevel" TEXT,
    "ChargerPowerKW" TEXT,
    "CombinedBrakingSystem" TEXT,
    "CoolingType" TEXT,
    "CurbWeightLB" TEXT,
    "CustomMotorcycleType" TEXT,
    "DaytimeRunningLight" TEXT,
    "DestinationMarket" TEXT,
    "DisplacementCC" TEXT,
    "DisplacementCI" TEXT,
    "DisplacementL" TEXT,
    "Doors" TEXT,
    "DriveType" TEXT,
    "DriverAssist" TEXT,
    "DynamicBrakeSupport" TEXT,
    "EDR" TEXT,
    "ESC" TEXT,
    "EVDriveUnit" TEXT,
    "ElectrificationLevel" TEXT,
    "EngineConfiguration" TEXT,
    "EngineCycles" TEXT,
    "EngineCylinders" TEXT,
    "EngineHP" TEXT,
    "EngineHP_to" TEXT,
    "EngineKW" TEXT,
    "EngineManufacturer" TEXT,
    "EngineModel" TEXT,
    "EntertainmentSystem" TEXT,
    "ErrorCode" TEXT,
    "ErrorText" TEXT,
    "ForwardCollisionWarning" TEXT,
    "FuelInjectionType" TEXT,
    "FuelTankMaterial" TEXT,
    "FuelTankType" TEXT,
    "FuelTypePrimary" TEXT,
    "FuelTypeSecondary" TEXT,
    "GCWR" TEXT,
    "GCWR_to" TEXT,
    "GVWR" TEXT,
    "GVWR_to" TEXT,
    "KeylessIgnition" TEXT,
    "LaneCenteringAssistance" TEXT,
    "LaneDepartureWarning" TEXT,
    "LaneKeepSystem" TEXT,
    "LowerBeamHeadlampLightSource" TEXT,
    "Make" TEXT,
    "MakeID" TEXT,
    "Manufacturer" TEXT,
    "ManufacturerId" TEXT,
    "Model" TEXT,
    "ModelID" TEXT,
    "ModelYear" TEXT,
    "MotorcycleChassisType" TEXT,
    "MotorcycleSuspensionType" TEXT,
    "NCSABodyType" TEXT,
    "NCSAMake" TEXT,
    "NCSAMapExcApprovedBy" TEXT,
    "NCSAMapExcApprovedOn" TEXT,
    "NCSAMappingException" TEXT,
    "NCSAModel" TEXT,
    "NCSANote" TEXT,
    "NonLandUse" TEXT,
    "Note" TEXT,
    "OtherBusInfo" TEXT,
    "OtherEngineInfo" TEXT,
    "OtherMotorcycleInfo" TEXT,
    "OtherRestraintSystemInfo" TEXT,
    "OtherTrailerInfo" TEXT,
    "ParkAssist" TEXT,
    "PedestrianAutomaticEmergencyBraking" TEXT,
    "PlantCity" TEXT,
    "PlantCompanyName" TEXT,
    "PlantCountry" TEXT,
    "PlantState" TEXT,
    "PossibleValues" TEXT,
    "Pretensioner" TEXT,
    "RearAutomaticEmergencyBraking" TEXT,
    "RearCrossTrafficAlert" TEXT,
    "RearVisibilitySystem" TEXT,
    "SAEAutomationLevel" TEXT,
    "SAEAutomationLevel_to" TEXT,
    "SeatBeltsAll" TEXT,
    "SeatRows" TEXT,
    "Seats" TEXT,
    "SemiautomaticHeadlampBeamSwitching" TEXT,
    "Series" TEXT,
    "Series2" TEXT,
    "SteeringLocation" TEXT,
    "SuggestedVIN" TEXT,
    "TPMS" TEXT,
    "TopSpeedMPH" TEXT,
    "TrackWidth" TEXT,
    "TractionControl" TEXT,
    "TrailerBodyType" TEXT,
    "TrailerLength" TEXT,
    "TrailerType" TEXT,
    "TransmissionSpeeds" TEXT,
    "TransmissionStyle" TEXT,
    "Trim" TEXT,
    "Trim2" TEXT,
    "Turbo" TEXT,
    "VIN" TEXT,
    "ValveTrainDesign" TEXT,
    "VehicleDescriptor" TEXT,
    "VehicleType" TEXT,
    "WheelBaseLong" TEXT,
    "WheelBaseShort" TEXT,
    "WheelBaseType" TEXT,
    "WheelSizeFront" TEXT,
    "WheelSizeRear" TEXT,
    "WheelieMitigation" TEXT,
    "Wheels" TEXT,
    "Windows" TEXT,

    CONSTRAINT "VinCheckResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripeCustomer" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripeSubscription" (
    "id" SERIAL NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripeSubscriptionItem" (
    "id" SERIAL NOT NULL,
    "stripeItemId" TEXT NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "priceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuctionAccessRequest" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "photoLink" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "activeSlotId" TEXT,
    "driverLicenceFileId" TEXT,
    "agreementFileId" TEXT,
    "auctionAccessNumber" TEXT,
    "bio" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AuctionAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeSlot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "auctionAccessRequestId" TEXT NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripeEvent" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPlan" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,
    "planPriceId" INTEGER NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "canceledAt" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" SERIAL NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reportsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanPrice" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "PlanPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "public"."EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "public"."PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "usage_aggregate_userId_featureKey_periodStart_periodEnd_key" ON "public"."usage_aggregate"("userId", "featureKey", "periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "public"."StripeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_stripeCustomerId_key" ON "public"."StripeCustomer"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_stripeSubscriptionId_key" ON "public"."StripeSubscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscriptionItem_stripeItemId_key" ON "public"."StripeSubscriptionItem"("stripeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeEvent_eventId_key" ON "public"."StripeEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_stripeSubscriptionId_key" ON "public"."UserPlan"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_userId_stripeSubscriptionId_key" ON "public"."UserPlan"("userId", "stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_stripeProductId_key" ON "public"."Plan"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "public"."Plan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlanPrice_stripePriceId_key" ON "public"."PlanPrice"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanPrice_slug_key" ON "public"."PlanPrice"("slug");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_aggregate" ADD CONSTRAINT "usage_aggregate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StripeCustomer" ADD CONSTRAINT "StripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StripeSubscription" ADD CONSTRAINT "StripeSubscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."StripeCustomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StripeSubscriptionItem" ADD CONSTRAINT "StripeSubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."StripeSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuctionAccessRequest" ADD CONSTRAINT "AuctionAccessRequest_activeSlotId_fkey" FOREIGN KEY ("activeSlotId") REFERENCES "public"."TimeSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlot" ADD CONSTRAINT "TimeSlot_auctionAccessRequestId_fkey" FOREIGN KEY ("auctionAccessRequestId") REFERENCES "public"."AuctionAccessRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPlan" ADD CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPlan" ADD CONSTRAINT "UserPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPlan" ADD CONSTRAINT "UserPlan_planPriceId_fkey" FOREIGN KEY ("planPriceId") REFERENCES "public"."PlanPrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanPrice" ADD CONSTRAINT "PlanPrice_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
