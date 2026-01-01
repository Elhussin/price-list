
"use client";
import { useState } from "react";
import { Upload, AlertCircle, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { useLenses } from '@/hooks/useLenses';

const Uploadpage = () => {
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState<{ total: number; success: number; failed: number } | null>(null);
    const [uploadMsg, setUploadMsg] = useState('');
    const { fetchCategories, error, uploadCSV } = useLenses();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            setUploadMsg('');
            setStats(null);

            try {
                const res = await uploadCSV(e.target.files[0]);

                if (res.total !== undefined) {
                    setStats({
                        total: res.total,
                        success: res.success,
                        failed: res.failed
                    });
                    setUploadMsg('Process completed');
                } else {
                    setUploadMsg(res.message || 'Upload successful');
                }

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
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Import and update lens inventory</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 transition-colors hover:border-blue-500/50">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Upload CSV File</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Drag and drop or click to select file
                        </p>
                    </div>

                    <label className="cursor-pointer">
                        <span className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                            {uploading ? 'Processing...' : 'Select CSV'}
                        </span>
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                    </label>
                </div>

                {(stats || uploadMsg) && (
                    <div className="mt-8 space-y-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">Upload Status</h4>

                        {stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Records</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                                    <div className="text-sm text-green-600 dark:text-green-400 mb-1 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Successful
                                    </div>
                                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.success}</div>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                                    <div className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
                                        <XCircle className="w-4 h-4" /> Failed
                                    </div>
                                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.failed}</div>
                                </div>
                            </div>
                        )}

                        {uploadMsg && !stats && (
                            <div className={`p-4 rounded-xl text-sm ${uploadMsg.startsWith('Error')
                                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                    : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                }`}>
                                {uploadMsg}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default Uploadpage;
