import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: Request) {
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


        // DB Operations
        const connection = await pool.getConnection();
        try {
            const query = `
          INSERT INTO lenses (sph, cyl, price, main_category, sub_category, diameter, qr_code)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            sph = VALUES(sph),
            cyl = VALUES(cyl),
            price = VALUES(price),
            main_category = VALUES(main_category),
            sub_category = VALUES(sub_category),
            diameter = VALUES(diameter)
        `;

            // Process one by one (auto-commit each statement)
            for (const row of results) {
                const sph = parseFloat(row.SPH || row.sph || 0);
                const cyl = parseFloat(row.CYL || row.cyl || 0);
                const price = parseFloat(row.PRICE || row.price || 0);
                const main = row.MAINCATEGORY || row.mainCategory || '';
                const sub = row.SUBCATEGORY || row.subCategory || '';
                const diameter = parseFloat(row.DIAMETER || row.diameter || 0);
                const qr = row.QRCODE || row.qrCode || row.qrcode || '';

                if (qr) {
                    await connection.query(query, [sph, cyl, price, main, sub, diameter, qr]);
                }
            }

            return NextResponse.json({ message: `Processed ${results.length} rows` });
        } catch (err) {
            console.error(err);
            return NextResponse.json({ error: 'Error processing CSV' }, { status: 500 });
        } finally {
            connection.release();
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
