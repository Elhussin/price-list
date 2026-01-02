import React from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { translations, Language } from '@/lib/translations';

interface HeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, language, setLanguage }) => {
    const t = translations[language];

    return (
        <header className="sticky top-0 z-50 w-full bg-emerald-900 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                        <Link href="https://www.alyosseroptical.com/en/" target="_blank">
                            <Image src="/logo.png" alt="Logo" width={50} height={50} />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r text-white bg-clip-text hidden sm:block">
                        {t.appName}
                    </h1>

                </div>
                <div className="flex items-center gap-2">
                    <Link href="/lap-lens" className="text-white">
                        <span className="text-white">اسعار التصنيع</span>
                    </Link>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:text-slate-800 hover:bg-slate-200 transition-colors text-yellow-500"
                        aria-label={t.darkMode}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        className="p-2 rounded-full hover:bg-slate-200/20 transition-colors text-white flex items-center gap-1 text-sm font-medium"
                        aria-label={t.language}
                    >
                        <Globe className="w-4 h-4" />
                        <span>{language === 'en' ? 'AR' : 'EN'}</span>
                    </button>
                </div>


            </div>
        </header>
    );
};

export default Header;
