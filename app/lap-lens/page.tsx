// app/prices/page.tsx
import React from 'react';

export default function PriceListPage() {
    return (
        <div className="w-full h-[calc(100vh-64px)]"> {/* تعديل الارتفاع حسب الـ Header */}
            <iframe
                src="/pricelist.htm"
                className="w-full h-full border-none"
                title="قائمة الأسعار"
            />
        </div>
    );
}