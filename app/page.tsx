'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import ResultsTable from '@/components/ResultsTable';
import QRScanner from '@/components/QRScanner';
import { useLenses } from '@/hooks/useLenses';
import { FilterState } from '@/types';
import { AlertCircle, Loader2, } from 'lucide-react';
import { translations, Language } from '@/lib/translations';




export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { lenses, categories, loading, error, fetchCategories, searchLenses, uploadCSV } = useLenses();

  const [filters, setFilters] = useState<FilterState>({
    sph: '',
    cyl: '',
    mainCategory: '',
    subCategory: '',
    discount: 0,
    search: '',
  });

  const t = translations[language];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950');
      document.body.classList.remove('bg-slate-50');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-slate-50');
      document.body.classList.remove('bg-slate-950');
    }
  }, [darkMode]);

  const handleQRScan = (code: string) => {
    const newFilters = {
      ...filters,
      search: code,
    };
    setFilters(newFilters);
    searchLenses(newFilters);
    setIsScannerOpen(false);
  };

  const handleSearch = () => {
    searchLenses(filters);
  };

  return (
    <div className={` min-h-screen ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="bg-emerald-100 dark:bg-slate-950 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-2">
        <section className="space-y-2 flex justify-between items-end">
          <div>
            {/* <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h2> */}
            <p className="text-slate-800 dark:text-slate-400 max-w-2xl">
              {t.subtitle}
            </p>
          </div>


        </section>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <InputForm
          filters={filters}
          setFilters={setFilters}
          mainCategories={categories.mainCategories}
          subCategories={categories.subCategories}
          subCategoriesByMain={categories.subCategoriesByMain}
          onOpenScanner={() => setIsScannerOpen(true)}
          onSearch={handleSearch}
          t={t}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium">{t.loading}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.availableLenses} ({lenses.length})
              </h3>
              {filters.discount > 0 && (
                <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {filters.discount}% {t.discountApplied}
                </span>
              )}
            </div>
            <ResultsTable lenses={lenses} discount={filters.discount} t={t} />
          </div>
        )}
      </main>

      {isScannerOpen && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      <footer className="py-12 px-4 border-t bg-emerald-900 border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-sm text-white dark:text-slate-400 italic">
            {t.footerQuote}
          </p>
          <p className="text-xs text-white dark:text-slate-600">
            &copy; {new Date().getFullYear()} {t.rightsReserved}
          </p>
          
           
        </div>
      </footer>
    </div>
  );
}
