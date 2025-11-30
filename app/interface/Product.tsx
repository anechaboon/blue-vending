export interface Product {
    id: string | number;
    title: string;
    price: string;
    stock: string;
    image: string | File;
    qty?: number;
}