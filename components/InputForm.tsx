import React from 'react';
import { Search, Percent, Layers, Glasses, FileSearch } from 'lucide-react';
import PowerInputs from './PowerInputs';
import CategorySelect from './CategorySelect';
import { FilterState } from '@/types';
import { translations } from '@/lib/translations';

interface InputFormProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    mainCategories: string[];
    subCategories: string[];
    subCategoriesByMain?: Record<string, string[]>;
    onOpenScanner: () => void;
    onSearch: () => void;
    t: typeof translations.en;
}

const InputForm: React.FC<InputFormProps> = ({
    filters,
    setFilters,
    mainCategories,
    subCategories,
    subCategoriesByMain,
    // onOpenScanner, // Reserved for future use
    onSearch,
    t
}) => {
    const updateFilter = (key: keyof FilterState, value: string | number) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleMainCategoryChange = (val: string) => {
        updateFilter('mainCategory', val);
        updateFilter('subCategory', ''); // Reset subcategory
    };

    const filteredSubCategories = filters.mainCategory
        ? (subCategoriesByMain?.[filters.mainCategory] || [])
        : subCategories;

    const isSearchDisabled = !filters.sph || !filters.cyl;

    return (
        <div className="bg-emerald-900 dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            {/* Same content ... */}
            {/* <div className="flex items-center gap-2 mb-6 text-slate-600">
                <FileSearch className="w-5 h-5" />
                <h2 className="text-sm font-semibold uppercase tracking-wider">{t.searchFilters}</h2>
            </div> */}

            <div className="grid grid-cols-1 xl:grid-cols-8 gap-6">
                {/* Prescription Section */}
                <div className="xl:col-span-8 flex flex-col">
                    <div className="h-full bg-emerald-300 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 relative group transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Glasses className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            {t.prescriptionDetails}
                        </h3>
                        <PowerInputs
                            sph={filters.sph}
                            cyl={filters.cyl}
                            onSphChange={(val) => updateFilter('sph', val)}
                            onCylChange={(val) => updateFilter('cyl', val)}
                        />
                    </div>
                </div>

                {/* Category Section */}
                <div className="xl:col-span-5 flex flex-col">
                    <div className="h-full bg-emerald-300 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 relative group transition-all hover:border-purple-200 dark:hover:border-purple-900/50">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Layers className="w-12 h-12 text-purple-600" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                            {t.lensCategory}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CategorySelect
                                label={t.mainCategory}
                                value={filters.mainCategory}
                                options={mainCategories}
                                onChange={handleMainCategoryChange}
                            />
                            <CategorySelect
                                label={t.subCategory}
                                value={filters.subCategory}
                                options={filteredSubCategories}
                                onChange={(val) => updateFilter('subCategory', val)}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="xl:col-span-3 flex flex-col gap-4">
                    <div className="bg-emerald-300 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex-1">
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            {t.discount}
                        </label>
                        <div className="relative mt-2">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={filters.discount}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => updateFilter('discount', parseInt(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onSearch}
                        disabled={isSearchDisabled}
                        className={`w-full  py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${isSearchDisabled
                            ? 'bg-slate-800 dark:bg-slate-800 text-white cursor-not-allowed border border-slate-200 dark:border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-blue-500/25 active:scale-95'
                            }`}
                    >
                        <Search className={`w-5 h-5 transition-transform ${!isSearchDisabled && 'group-hover:scale-110'}`} />
                        <span>{t.searchStock}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputForm;
