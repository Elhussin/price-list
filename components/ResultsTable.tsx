import React, { useState } from 'react';
import { Lens, SortConfig } from '@/types';
import { ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';

interface ResultsTableProps {
    lenses: Lens[];
    discount: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ lenses, discount }) => {
    const [sort, setSort] = useState<SortConfig>({ key: null, direction: 'asc' });

    const handleSort = (key: keyof Lens) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const calculateDiscountedPrice = (price: any) => {
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

    if (lenses.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No lenses found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or scan a different code.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            {['Category', 'QR Code', 'Price', 'SPH', 'CYL', 'Diameter',].map((header, idx) => {
                                const keys: (keyof Lens)[] = ['MAINCATEGORY', 'QRCODE', 'PRICE', 'SPH', 'CYL', 'DIAMETER'];
                                const key = keys[idx];
                                return (
                                    <th
                                        key={header}
                                        onClick={() => handleSort(key)}
                                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-blue-500 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {header}
                                            <SortIcon column={key} />
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {sortedLenses.map((lens, i) => {
                            const sph = Number(lens.SPH) || 0;
                            const cyl = Number(lens.CYL) || 0;
                            const diameter = Number(lens.DIAMETER) || 0;
                            const price = Number(lens.PRICE) || 0;

                            return (
                                <tr key={`${lens.QRCODE}-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">

                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{lens.MAINCATEGORY}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{lens.SUBCATEGORY}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{lens.QRCODE}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            {discount > 0 && (
                                                <span className="text-xs text-slate-400 line-through">
                                                    ${price.toFixed(2)}
                                                </span>
                                            )}
                                            <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                                                ${calculateDiscountedPrice(price)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-sm font-medium ${sph >= 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'}`}>
                                            {sph > 0 ? `+${sph.toFixed(2)}` : sph.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {cyl >= 0 ? `+${cyl.toFixed(2)}` : cyl.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                        {diameter}mm
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {lenses.length} results
                </p>
            </div>
        </div>
    );
};

export default ResultsTable;
