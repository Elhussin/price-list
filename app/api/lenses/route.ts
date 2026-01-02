import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sph = searchParams.get('sph');
        const cyl = searchParams.get('cyl');
        const mainCategory = searchParams.get('mainCategory');
        const subCategory = searchParams.get('subCategory');
        const search = searchParams.get('search');
        console.log(sph, cyl, mainCategory, subCategory, search);
        let query = 'SELECT * FROM lenses WHERE 1=1';
        const params: any[] = [];

        if (sph) {
            query += ' AND sph = ?';
            params.push(sph);
        }
        if (cyl) {
            query += ' AND cyl = ?';
            params.push(cyl);
        }
        if (mainCategory) {
            query += ' AND main_category = ?';
            params.push(mainCategory);
        }
        if (subCategory) {
            query += ' AND sub_category = ?';
            params.push(subCategory);
        }
        if (search) {
            query += ' AND (qr_code LIKE ? OR main_category LIKE ? OR sub_category LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        console.log(query, params);

        const [rows] = await pool.execute(query, params);
    

        // Map to frontend interface
        const formattedRows = (rows as any[]).map(row => ({
            SPH: parseFloat(row.sph),
            CYL: parseFloat(row.cyl),
            PRICE: parseFloat(row.price),
            MAINCATEGORY: row.main_category,
            SUBCATEGORY: row.sub_category,
            DIAMETER: parseFloat(row.diameter),
            QRCODE: row.qr_code,
            MAINCATEGORYEN: row.MAINCATEGORYEN,
            SUBCATEGORYEN: row.SUBCATEGORYEN,
        }));

        return NextResponse.json(formattedRows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
