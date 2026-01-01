import { useState, useCallback } from 'react';
import { Lens, FilterState } from '@/types';
import { transposePrescription, formatPower } from '@/utils/transpose';

export const useLenses = () => {
    const [lenses, setLenses] = useState<Lens[]>([]);
    const [categories, setCategories] = useState<{ 
        mainCategories: string[], 
        subCategories: string[],
        subCategoriesByMain: Record<string, string[]> 
    }>({
        mainCategories: [],
        subCategories: [],
        subCategoriesByMain: {}
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories initially
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`/api/categories`);
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories({
                mainCategories: data.mainCategories,
                subCategories: data.allSubCategories || [],
                subCategoriesByMain: data.subCategoriesByMain || {}
            });
        } catch (err: any) {
            console.error(err);
            // Fallback or ignore if DB empty
        }
    }, []);

    // Fetch lenses based on filters
    const searchLenses = useCallback(async (filters: FilterState) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            
            // Validate inputs if present
            if(filters.sph !== '' && isNaN(Number(filters.sph))){
                 setError('Please enter a valid SPH value'); return;
            }
            if(filters.cyl !== '' && isNaN(Number(filters.cyl))){
                 setError('Please enter a valid CYL value'); return;
            }

            let searchSph = filters.sph;
            let searchCyl = filters.cyl;

            // Apply transposition for search if both values are present
            if (searchSph !== '' && searchCyl !== '') {
                const sVal = parseFloat(searchSph);
                const cVal = parseFloat(searchCyl);
                // Transpose (converts +CYL to -CYL)
                const transposed = transposePrescription(sVal, cVal);
                
                // Always use formatted values for consistency with DB
                searchSph = formatPower(transposed.sph);
                searchCyl = formatPower(transposed.cyl);
            }

            if (searchSph !== '') params.append('sph', searchSph);
            if (searchCyl !== '') params.append('cyl', searchCyl);
            if (filters.mainCategory) params.append('mainCategory', filters.mainCategory);
            if (filters.subCategory) params.append('subCategory', filters.subCategory);
            if (filters.search) params.append('search', filters.search);

            const res = await fetch(`/api/lenses?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch lenses');

            const data = await res.json();
            setLenses(data);
        } catch (err: any) {
            setError(err.message || 'Failed to search lenses');
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadCSV = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`/api/upload`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            return await res.json();
        } catch (e) {
            throw e;
        }
    };

    return { lenses, categories, loading, error, fetchCategories, searchLenses, uploadCSV };
};
