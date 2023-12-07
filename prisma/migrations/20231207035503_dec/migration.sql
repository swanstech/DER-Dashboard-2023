/*
  Warnings:

  - You are about to drop the `der_device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `der_device_security` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `der_nameplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `der_network_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_monitoring_energy_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "der_device" DROP CONSTRAINT "der_device_nameplate_id_fkey";

-- DropForeignKey
ALTER TABLE "der_device_security" DROP CONSTRAINT "der_device_security_device_id_fkey";

-- DropForeignKey
ALTER TABLE "der_network_data" DROP CONSTRAINT "der_network_data_device_id_fkey";

-- DropForeignKey
ALTER TABLE "device_monitoring_energy_data" DROP CONSTRAINT "device_monitoring_energy_data_device_id_fkey";

-- DropTable
DROP TABLE "der_device";

-- DropTable
DROP TABLE "der_device_security";

-- DropTable
DROP TABLE "der_nameplate";

-- DropTable
DROP TABLE "der_network_data";

-- DropTable
DROP TABLE "device_monitoring_energy_data";
