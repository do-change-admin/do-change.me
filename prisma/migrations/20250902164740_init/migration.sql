-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "emailVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userMail" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usage_aggregate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "usage_aggregate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VinCheckResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "vPlantCity" TEXT NOT NULL,
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
    "Windows" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "usage_aggregate_userId_featureKey_periodStart_periodEnd_key" ON "usage_aggregate"("userId", "featureKey", "periodStart", "periodEnd");
