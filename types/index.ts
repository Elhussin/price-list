
export interface Lens {
    SPH: number;
    CYL: number;
    PRICE: number;
    MAINCATEGORY: string;
    SUBCATEGORY: string;
    MAINCATEGORYEN: string;
    SUBCATEGORYEN: string;
    DIAMETER: number;
    QRCODE: string;
}

export interface FilterState {
    sph: string;
    cyl: string;
    mainCategory: string;
    subCategory: string;
    discount: number;
    search: string;
}

export interface SortConfig {
    key: keyof Lens | null;
    direction: 'asc' | 'desc';
}
