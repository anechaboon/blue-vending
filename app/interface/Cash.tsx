export interface Cash {
    id: string | number;
    cash_type: string;
    cash: number;
    stock: number;
    quantity?: number;
}