import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT DISTINCT main_category, sub_category FROM lenses WHERE main_category IS NOT NULL AND main_category != ""');

        const mainCategories = new Set<string>();
        const subCategoriesByMain: Record<string, Set<string>> = {};

        (rows as any[]).forEach(row => {
            const main = row.main_category;
            const sub = row.sub_category;
            
            mainCategories.add(main);
            
            if (sub) {
                if (!subCategoriesByMain[main]) {
                    subCategoriesByMain[main] = new Set();
                }
                subCategoriesByMain[main].add(sub);
            }
        });

        // Convert Sets to Arrays and sort
        const sortedMain = Array.from(mainCategories).sort();
        const sortedSubByMain: Record<string, string[]> = {};
        
        Object.keys(subCategoriesByMain).forEach(key => {
            sortedSubByMain[key] = Array.from(subCategoriesByMain[key]).sort();
        });

        // Also fetch all subcategories just in case (optional, but good for "All" view if needed)
        // For strict filtering, the mapping is enough.
        // Let's return a specific structure.
        
        return NextResponse.json({
            mainCategories: sortedMain,
            subCategoriesByMain: sortedSubByMain,
            // Keep flat list for backward compat if needed, or derive it
            allSubCategories: Array.from(new Set(Object.values(sortedSubByMain).flat())).sort()
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
