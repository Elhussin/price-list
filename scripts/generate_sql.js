const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const inputFile = path.join(__dirname, "../public/data.csv");
const outputFile = path.join(__dirname, "../public/insert_lenses.sql");

const results = [];
const writeStream = fs.createWriteStream(outputFile, { encoding: "utf8" });
writeStream.write("SET FOREIGN_KEY_CHECKS = 0;\n");

function escapeSql(val) {
  if (val === null || val === undefined) return "''";
  return "'" + String(val).replace(/'/g, "''").trim() + "'";
}

console.log(`Reading from ${inputFile}...`);

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(`Parsed ${results.length} records. Generating SQL...`);

    const batchSize = 500;
    let processedCount = 0;

    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);

      const values = batch
        .map((row) => {
          // Ensure we handle missing keys gracefully and escape values
          const rawSph = row.SPH || row.sph;
          const rawCyl = row.CYL || row.cyl;
          const sphNum = parseFloat(rawSph);
          const cylNum = parseFloat(rawCyl);
          
          // Use numeric values directly for SQL INSERT
          const sph = isNaN(sphNum) ? "NULL" : sphNum; 
          const cyl = isNaN(cylNum) ? "NULL" : cylNum;

          // Other fields (unchanged formatting)
          const priceNum = parseFloat(row.PRICE || row.price || "0");
          const price = priceNum; // numeric, not quoted
          const mainCategory = escapeSql(row.MAINCATEGORY || row.main_category);
          const subCategory = escapeSql(row.SUBCATEGORY || row.sub_category);
          const diameterNum = parseFloat(row.DIAMETER || row.diameter || "0");
          const diameter = diameterNum; // numeric
          const qrRaw = row.QRCODE || row.qr_code;
          if (!qrRaw) return null; // skip rows without QR code
          const qrCode = escapeSql(qrRaw);
          const mainCategoryEn = escapeSql(
            row.MAINCATEGORYEN || row.mainCategoryEn
          );
          const subCategoryEn = escapeSql(
            row.SUBCATEGORYEN || row.subCategoryEn
          );

          return `(${sph}, ${cyl}, ${price}, ${mainCategory}, ${subCategory}, ${diameter}, ${qrCode}, ${mainCategoryEn}, ${subCategoryEn})`;
        })
        .join(",\n");

      // Use the verified column names from previous steps
      const sqlQuery = `INSERT INTO lenses (sph, cyl, price, main_category, sub_category, diameter, qr_code, MAINCATEGORYEN, SUBCATEGORYEN) VALUES \n${values};\n`;

      writeStream.write(sqlQuery);
      processedCount += batch.length;
    }

    writeStream.end();
    console.log(`Successfully generated SQL file at ${outputFile}`);
    console.log(`Total rows processed: ${processedCount}`);
    console.log(
      `To import, run: mysql -u [user] -p [db_name] < public/insert_lenses.sql`
    );
  })
  .on("error", (err) => {
    console.error("Error reading CSV:", err);
  });
// node scripts/generate_sql.js

// table structure
// CREATE TABLE `lenses` (
//   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Changed: Added Auto Increment & Primary Key
//   `sph` decimal(5,2) DEFAULT NULL,
//   `cyl` decimal(5,2) DEFAULT NULL,
//   `price` decimal(10,2) DEFAULT NULL,
//   `main_category` varchar(255) DEFAULT NULL,
//   `sub_category` varchar(255) DEFAULT NULL,
//   `diameter` decimal(5,2) DEFAULT NULL,
//   `qr_code` varchar(255) DEFAULT NULL,
//   `SUBCATEGORYEN` text NOT NULL,
//   `MAINCATEGORYEN` text NOT NULL
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;