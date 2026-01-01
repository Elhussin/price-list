import React from 'react';
import { generateRange, transposePrescription, formatPower } from '@/utils/transpose';
import { ChevronDown } from 'lucide-react';

interface PowerInputsProps {
    sph: string;
    cyl: string;
    onSphChange: (val: string) => void;
    onCylChange: (val: string) => void;
}

const getPowerColor = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num === 0) return 'text-slate-900 dark:text-white';
    return num < 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400';
};

const PowerInputs: React.FC<PowerInputsProps> = ({ sph, cyl, onSphChange, onCylChange }) => {
    const sphList = generateRange(-20, 20, 0.25);
    const cylList = generateRange(-6, 6, 0.25);

    const handleTransposition = () => {
        const s = parseFloat(sph);
        const c = parseFloat(cyl);

        if (!isNaN(s) && !isNaN(c) && c > 0) {
            const transposed = transposePrescription(s, c);
            onSphChange(formatPower(transposed.sph));
            onCylChange(formatPower(transposed.cyl));
        }
    };

    // Ensure we have a valid value for the select (default to +0.00 if empty)
    const safeSph = sph || '';
    const safeCyl = cyl || '';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sphere (SPH)
                </label>
                <div className="relative">
                    <select
                        dir="ltr"
                        value={safeSph}
                        onChange={(e) => onSphChange(e.target.value)}
                        onBlur={handleTransposition}
                        className={`w-full appearance-none pl-4 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium cursor-pointer ${getPowerColor(safeSph)}`}
                    >
                        <option value="" >Select SPH</option>
                        {sphList.map((opt) => (
                            <option key={opt} value={opt} dir="ltr" className={`bg-white dark:bg-slate-800 ${getPowerColor(opt)}`}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Cylinder (CYL)
                </label>
                <div className="relative">
                    <select
                        dir="ltr"
                        value={safeCyl}
                        onChange={(e) => onCylChange(e.target.value)}
                        onBlur={handleTransposition}
                        className={`w-full appearance-none pl-4 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium cursor-pointer ${getPowerColor(safeCyl)}`}
                    >
                        <option value="">Select CYL</option>
                        {cylList.map((opt) => (
                            <option dir="ltr" key={opt} value={String(opt)} className={`bg-white dark:bg-slate-800 ${getPowerColor(opt)}`}>
                                {String(opt)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default PowerInputs;
