import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, XCircle } from 'lucide-react';

interface QRScannerProps {
    onScan: (qrCode: string) => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
                supportedScanTypes: [0] // 0 for QR Code
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                scanner.clear();
                onClose();
            },
            (errorMessage) => {
                // Silently ignore regular scanning failures
            }
        );

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        };
    }, [onScan, onClose]);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                        <Camera className="w-5 h-5 text-blue-500" />
                        Scan QR Code
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4">
                    <div id="reader" className="w-full rounded-lg overflow-hidden border-0"></div>
                    {error && (
                        <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
                    )}
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center italic">
                        Align the lens QR code within the frame to auto-fill details.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
