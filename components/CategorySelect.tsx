import React from 'react';

interface CategorySelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ label, value, options, onChange }) => {
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-emerald-800 dark:border-slate-700 bg-emerald-100 dark:bg-slate-800 shadow-sm focus:ring-2 focus:emerald-900 focus:border-transparent transition-all outline-none appearance-none"
            >
                <option value="" className='text-slate-900 bg-emerald-100 dark:text-slate-100' >All Categories</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} dir="ltr" className='text-slate-900 bg-emerald-100 dark:text-slate-100'>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategorySelect;

