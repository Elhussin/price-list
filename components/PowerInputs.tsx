import React, { useState, useEffect, useRef } from 'react';
import { generateRange, transposePrescription, formatPower } from '@/utils/transpose';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

interface CustomPowerSelectProps {
    label: string;
    value: string;
    options: (number | string)[];
    onChange: (val: string) => void;
    placeholder: string;
    onClose?: () => void;
}

const CustomPowerSelect: React.FC<CustomPowerSelectProps> = ({ label, value, options, onChange, placeholder, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (onClose) onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {label}
            </label>
            <button
                dir="ltr"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium ${getPowerColor(value)}`}
            >
                <span>{value || placeholder}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
                    {/* Added 'grid-cols-3' for the requested grid layout */}
                    <div className="grid grid-cols-3 gap-1 p-2">
                        {/* Option to clear selection */}
                        <button
                            onClick={() => handleSelect('')}
                            className="col-span-3 py-2 px-1 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium"
                        >
                            {placeholder}
                        </button>
                        {options.map((opt) => {
                            const valStr = String(opt);
                            const valNum = parseFloat(valStr);
                            // If it's a number, format it nicely. If it's a string, use it as is but try to consistent formatting if possible.
                            const displayLabel = typeof opt === 'number'
                                ? (opt > 0 ? `+${opt.toFixed(2)}` : opt.toFixed(2))
                                : valStr;

                            return (
                                <button
                                    key={valStr}
                                    dir="ltr"
                                    onClick={() => handleSelect(valStr)}
                                    className={`py-2 px-1 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${getPowerColor(valStr)} ${value === valStr ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-500' : ''}`}
                                >
                                    {displayLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const PowerInputs: React.FC<PowerInputsProps> = ({ sph, cyl, onSphChange, onCylChange }) => {
    const sphList = generateRange(-20, 20, 0.25);
    const cylList = generateRange(-6, 6, 0.25);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomPowerSelect
                label="Sphere (SPH)"
                value={sph}
                options={sphList}
                onChange={onSphChange}
                placeholder="Select SPH"
            />

            <CustomPowerSelect
                label="Cylinder (CYL)"
                value={cyl}
                options={cylList}
                onChange={onCylChange}
                placeholder="Select CYL"
            />
        </div>
    );
};

export default PowerInputs;
