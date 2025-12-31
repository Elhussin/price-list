'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import ResultsTable from '@/components/ResultsTable';
import QRScanner from '@/components/QRScanner';
import { useLenses } from '@/hooks/useLenses';
import { FilterState } from '@/types';
import { AlertCircle, Loader2, Upload } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
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

  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      setUploadMsg('');
      try {
        const res = await uploadCSV(e.target.files[0]);
        setUploadMsg(res.message || 'Upload successful');
        // Refresh categories
        fetchCategories();
      } catch (err: any) {
        setUploadMsg('Error: ' + err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950`}>
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="space-y-2 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find the Perfect Lens
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              Enter the prescription details or scan the lens package QR code to quickly filter available stock.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              Import CSV Data
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploading && <span className="text-xs text-slate-500 mt-1">Uploading...</span>}
            {uploadMsg && <span className={`text-xs mt-1 ${uploadMsg.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{uploadMsg}</span>}
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
          onOpenScanner={() => setIsScannerOpen(true)}
          onSearch={handleSearch}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium">Searching lens database...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Available Lenses ({lenses.length})
              </h3>
              {filters.discount > 0 && (
                <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {filters.discount}% Discount Applied
                </span>
              )}
            </div>
            <ResultsTable lenses={lenses} discount={filters.discount} />
            {lenses.length === 0 && !loading && !error && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                No lenses found. Adjust filters and click Search.
              </div>
            )}
          </div>
        )}
      </main>

      {isScannerOpen && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            "Precision in every view. Clarity in every frame."
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} OptiLens Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
