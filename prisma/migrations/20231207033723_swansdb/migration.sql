-- CreateTable
CREATE TABLE "der_device" (
    "device_id" SERIAL NOT NULL,
    "nameplate_id" INTEGER NOT NULL,
    "device_name" VARCHAR(255) NOT NULL,
    "device_model_number" VARCHAR(255) NOT NULL,
    "device_location" VARCHAR(255) NOT NULL,

    CONSTRAINT "der_device_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "der_device_security" (
    "device_security_id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "device_security_certificate_number" VARCHAR(255) NOT NULL,
    "device_security_certificate_expdate" DATE NOT NULL,

    CONSTRAINT "der_device_security_pkey" PRIMARY KEY ("device_security_id")
);

-- CreateTable
CREATE TABLE "der_nameplate" (
    "nameplate_id" SERIAL NOT NULL,
    "der_max_input_voltage" DECIMAL(6,2) NOT NULL,
    "der_max_input_current" DECIMAL(6,2) NOT NULL,
    "der_max_output_voltage" DECIMAL(6,2) NOT NULL,
    "der_output_power" DECIMAL(6,2) NOT NULL,
    "der_output_frequency" DECIMAL(6,2) NOT NULL,
    "der_max_output_current" DECIMAL(6,2) NOT NULL,
    "der_operating_temp_range" VARCHAR(20) NOT NULL,

    CONSTRAINT "der_nameplate_pkey" PRIMARY KEY ("nameplate_id")
);

-- CreateTable
CREATE TABLE "der_network_data" (
    "der_network_id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "device_location" VARCHAR(255),
    "mac_address" VARCHAR(255),
    "connection" VARCHAR(255),
    "ip_address" VARCHAR(255),

    CONSTRAINT "der_network_data_pkey" PRIMARY KEY ("der_network_id")
);

-- CreateTable
CREATE TABLE "device_monitoring_energy_data" (
    "data_id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6),
    "active_power" DECIMAL(6,2) NOT NULL,
    "reactive_power" DECIMAL(6,2) NOT NULL,
    "apparent_power" DECIMAL(6,2) NOT NULL,
    "voltage" DECIMAL(6,2) NOT NULL,
    "current" DECIMAL(6,2) NOT NULL,
    "frequency" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "device_monitoring_energy_data_pkey" PRIMARY KEY ("data_id")
);

-- AddForeignKey
ALTER TABLE "der_device" ADD CONSTRAINT "der_device_nameplate_id_fkey" FOREIGN KEY ("nameplate_id") REFERENCES "der_nameplate"("nameplate_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "der_device_security" ADD CONSTRAINT "der_device_security_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "der_device"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "der_network_data" ADD CONSTRAINT "der_network_data_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "der_device"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "device_monitoring_energy_data" ADD CONSTRAINT "device_monitoring_energy_data_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "der_device"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
