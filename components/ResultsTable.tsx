import React, { useState } from 'react';
import { Lens, SortConfig } from '@/types';
import { ChevronUp, ChevronDown, ShoppingBag, CircleSlash2 } from 'lucide-react';
import { translations } from '@/lib/translations';

interface ResultsTableProps {
    lenses: Lens[];
    discount: number;
    t: typeof translations.en;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ lenses, discount, t }) => {
    console.log(lenses);
    const [sort, setSort] = useState<SortConfig>({ key: null, direction: 'asc' });

    const handleSort = (key: keyof Lens) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const calculateDiscountedPrice = (price: number | string) => {
        const numPrice = Number(price) || 0;
        const discounted = numPrice * (1 - discount / 100);
        return discounted.toFixed(2);
    };

    const sortedLenses = [...lenses].sort((a, b) => {
        if (!sort.key) return 0;
        const key = sort.key!;
        const aVal = a[key];
        const bVal = b[key];

        // Safety check for numeric sorting
        const valA = typeof aVal === 'number' ? aVal : parseFloat(String(aVal)) || 0;
        const valB = typeof bVal === 'number' ? bVal : parseFloat(String(bVal)) || 0;

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ column }: { column: keyof Lens }) => {
        if (sort.key !== column) return <div className="w-4 h-4 opacity-20"><ChevronDown className="w-full h-full" /></div>;
        return sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />;
    };


    console.log(sortedLenses);
    if (lenses.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t.noResults}</h3>
                <p className="text-slate-500 dark:text-slate-400">{t.noResultsDesc}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.sortBy}</span>
                <div className="flex flex-wrap gap-2">
                    {[t.category, t.qrCode, t.price, t.sphere, t.cylinder, t.diameter].map((header, idx) => {
                        const keys: (keyof Lens)[] = ['MAINCATEGORY', 'QRCODE', 'PRICE', 'SPH', 'CYL', 'DIAMETER'];
                        const key = keys[idx];
                        const isActive = sort.key === key;
                        return (
                            <button
                                key={header}
                                onClick={() => handleSort(key)}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                    ${isActive
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-500/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }
                                `}
                            >
                                {header}
                                {isActive && <SortIcon column={key} />}
                            </button>
                        );
                    })}
                </div>
                <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                    {t.showingResults.replace('{count}', lenses.length.toString())}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedLenses.map((lens, i) => {
                    const sph = Number(lens.SPH) || 0;
                    const cyl = Number(lens.CYL) || 0;
                    const diameter = Number(lens.DIAMETER) || 0;
                    const price = Number(lens.PRICE) || 0;

                    return (
                        <div
                            key={`${lens.QRCODE}-${i}`}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                        >
                            <div className="space-y-4 ">
                                {/*  ←‑‑ أضف dir="ltr" أو style={{ direction: 'ltr' }} هنا */}
                                <div className="space-y-4" dir="ltr">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h4
                                                className="font-semibold text-slate-900 dark:text-white line-clamp-1"
                                                title={lens.MAINCATEGORYEN}
                                            >
                                                {lens.MAINCATEGORYEN}
                                            </h4>
                                            <p
                                                className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1"
                                                title={lens.SUBCATEGORYEN}
                                            >
                                                {lens.SUBCATEGORYEN}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <h4
                                                className="font-semibold text-slate-900 dark:text-white line-clamp-1"
                                                title={lens?.MAINCATEGORY}
                                            >
                                                {lens?.MAINCATEGORY}
                                            </h4>
                                            <p
                                                className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1"
                                                title={lens?.SUBCATEGORY}
                                            >
                                                {lens?.SUBCATEGORY}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <span className="text-[10px] uppercase text-slate-400 font-semibold">{t.sphere}</span>
                                        <span className={`text-sm font-bold ${sph >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                            {sph > 0 ? `+${sph.toFixed(2)}` : sph.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <span className="text-[10px] uppercase text-slate-400 font-semibold">{t.cylinder}</span>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {cyl >= 0 ? `+${cyl.toFixed(2)}` : cyl.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <span className="text-[10px] uppercase text-slate-400 font-semibold">{t.dia}</span>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {diameter}
                                        </span>
                                    </div>
                                </div> */}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                                <div dir="ltr" className="flex items-center  gap-2 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                    {String(lens.QRCODE)} <span className="text-xs text-slate-400 flex items-center gap-1"><CircleSlash2 className="w-4 h-4" />{diameter}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    {discount > 0 && (
                                        <span className="text-xs text-slate-400 line-through">
                                            EG{price.toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        EG{calculateDiscountedPrice(price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.showingResults.replace('{count}', lenses.length.toString())}
                </p>
            </div>
        </div>
    );
};

export default ResultsTable;
