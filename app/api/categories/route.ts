import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [mainRows] = await pool.query('SELECT DISTINCT main_category FROM lenses WHERE main_category IS NOT NULL AND main_category != ""');
        const [subRows] = await pool.query('SELECT DISTINCT sub_category FROM lenses WHERE sub_category IS NOT NULL AND sub_category != ""');

        return NextResponse.json({
            mainCategories: (mainRows as any[]).map(r => r.main_category).sort(),
            subCategories: (subRows as any[]).map(r => r.sub_category).sort()
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
