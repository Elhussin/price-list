import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: Request) {
    let connection;
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer.toString());
        const results: any[] = [];

        // Parse CSV
        await new Promise((resolve, reject) => {
            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        connection = await pool.getConnection();

        const BATCH_SIZE = 500; // Process 500 rows at a time
        let successCount = 0;
        let failureCount = 0;

        // Loop through data in batches
        for (let i = 0; i < results.length; i += BATCH_SIZE) {
            const batch = results.slice(i, i + BATCH_SIZE);
            const values: any[] = [];
            const placeholders: string[] = [];

            // Prepare batch data
            for (const row of batch) {
                const qr = row.QRCODE || row.qrCode || row.qrcode || '';

                // Skip rows without valid identifier
                if (!qr) continue;

                // Format sph and cyl with explicit sign and two decimals
                const rawSph = row.SPH || row.sph || '0';
                const rawCyl = row.CYL || row.cyl || '0';
                const sphNum = parseFloat(rawSph);
                const cylNum = parseFloat(rawCyl);
                const sph = (sphNum >= 0 ? '+' : '-') + Math.abs(sphNum).toFixed(2);
                const cyl = (cylNum >= 0 ? '+' : '-') + Math.abs(cylNum).toFixed(2);
                const price = parseFloat(row.PRICE || row.price || '0');
                const main = row.MAINCATEGORY || row.mainCategory || '';
                const sub = row.SUBCATEGORY || row.subCategory || '';
                const diameter = parseFloat(row.DIAMETER || row.diameter || '0');
                const mainCategoryEn = row.MAINCATEGORYEN || row.mainCategoryEn || '';
                const subCategoryEn = row.SUBCATEGORYEN || row.subCategoryEn || '';

                const placeholder = '(?, ?, ?, ?, ?, ?, ?, ?, ?)';
                placeholders.push(placeholder);
                values.push(sph, cyl, price, main, sub, diameter, qr, mainCategoryEn, subCategoryEn);
            }

            if (placeholders.length === 0) continue;

            const query = `
                INSERT INTO lenses (sph, cyl, price, main_category, sub_category, diameter, qr_code, MAINCATEGORYEN, SUBCATEGORYEN)
                VALUES ${placeholders.join(', ')}
                ON DUPLICATE KEY UPDATE
                    sph = VALUES(sph),
                    cyl = VALUES(cyl),
                    price = VALUES(price),
                    main_category = VALUES(main_category),
                    sub_category = VALUES(sub_category),
                    diameter = VALUES(diameter),
                    MAINCATEGORYEN = VALUES(MAINCATEGORYEN),
                    SUBCATEGORYEN = VALUES(SUBCATEGORYEN)
            `;

            try {
                // Execute batch insert
                await connection.query(query, values);
                // In ON DUPLICATE KEY UPDATE, affectedRows can be 2 if updated, 1 if inserted. 
                // We'll roughly count processed rows as success.
                // For exact counts of inserts vs updates, we'd need deeper logic, but for "success", checking no error is enough.
                successCount += placeholders.length;
            } catch (err) {
                console.error('Batch insert error:', err);
                failureCount += placeholders.length; // Count the whole batch as failed if the query fails
            }
        }

        return NextResponse.json({
            message: 'Upload processing complete',
            total: results.length,
            success: successCount,
            failed: failureCount
        });

    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
