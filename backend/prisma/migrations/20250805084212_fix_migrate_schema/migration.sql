/*
  Warnings:

  - A unique constraint covering the columns `[name,location]` on the table `Cinema` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cinemaId,name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cinema_name_location_key` ON `Cinema`(`name`, `location`);

-- CreateIndex
CREATE UNIQUE INDEX `Movie_title_key` ON `Movie`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Room_cinemaId_name_key` ON `Room`(`cinemaId`, `name`);
