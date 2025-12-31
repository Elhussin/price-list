import React from 'react';
import { Search, Percent, QrCode } from 'lucide-react';
import PowerInputs from './PowerInputs';
import CategorySelect from './CategorySelect';
import { FilterState } from '@/types';

interface InputFormProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    mainCategories: string[];
    subCategories: string[];
    onOpenScanner: () => void;
    onSearch: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
    filters,
    setFilters,
    mainCategories,
    subCategories,
    onOpenScanner,
    onSearch
}) => {
    const updateFilter = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 space-y-6 transition-colors">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="flex-1 space-y-6">
                    <PowerInputs
                        sph={filters.sph}
                        cyl={filters.cyl}
                        onSphChange={(val) => updateFilter('sph', val)}
                        onCylChange={(val) => updateFilter('cyl', val)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CategorySelect
                            label="Main Category"
                            value={filters.mainCategory}
                            options={mainCategories}
                            onChange={(val) => updateFilter('mainCategory', val)}
                        />
                        <CategorySelect
                            label="Sub Category"
                            value={filters.subCategory}
                            options={subCategories}
                            onChange={(val) => updateFilter('subCategory', val)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[240px]">
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Discount (%)
                        </label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={filters.discount}
                                onChange={(e) => updateFilter('discount', parseInt(e.target.value) || 0)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onOpenScanner}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                        <QrCode className="w-5 h-5" />
                        Scan QR Code
                    </button>
                </div>
            </div>

            <div className="relative pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        placeholder="Search by category, feature, or serial..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 text-slate-900 dark:text-white outline-none transition-all"
                    />
                </div>
                <button
                    onClick={onSearch}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                >
                    <Search className="w-5 h-5" />
                    Search
                </button>
            </div>
        </div>
    );
};

export default InputForm;
