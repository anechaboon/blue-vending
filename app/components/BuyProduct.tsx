import { Product } from '@/app/interface/Product';
import React from "react";
import Swal from "sweetalert2";

interface Props {
    selected: Product;
    onAddToCart: (product: Product, quantity: number, buy_now?: boolean) => void;
}

export default function BuyProductModalComp({ selected, onAddToCart }: Props) {
    
    const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
    const [quantity, setQuantity] = React.useState<number>(0);

    // reset quantity เมื่อสินค้าเปลี่ยน
    React.useEffect(() => {
        setQuantity(0);
    }, [selected]);

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity < 0) return;
        if (newQuantity > Number(selected.stock)) {
            Swal.fire({
                icon: 'warning',
                title: 'Insufficient Stock',
                text: `Only ${selected.stock} items available in stock.`,
            });
            return;
        }
        setQuantity(newQuantity);
    }

    return (
        <div>
            <div className="flex flex-row justify-between mb-4">
                <h2 className="text-2xl font-bold">{selected.title}</h2>
                <h2 className="text-2xl font-bold">{selected.price} ฿</h2>
            </div>

            {/* Preview */}
            <div className="mb-4">
                <div
                    id="image-preview"
                    className="w-full h-48 border border-gray-300 rounded bg-gray-100 bg-center bg-contain flex items-center justify-center"
                    style={{
                        backgroundRepeat: "no-repeat",
                        backgroundImage:
                            selected.image
                                ? `url(${BASE_URL}/products/${selected.image})`
                                : undefined,
                    }}
                >
                    {!selected.image && (
                        <span className="text-gray-400">Image not found</span>
                    )}
                </div>
            </div>

            {/* Increase or Decrease Quantity */}
            <div className="flex flex-row justify-between mb-4">
                <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white text-xl rounded"
                    onClick={() => handleUpdateQuantity(quantity - 1)}
                >
                    -
                </button>

                <span className="text-xl font-semibold">{quantity}</span>

                <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white text-xl rounded"
                    onClick={() => handleUpdateQuantity(quantity + 1)}

                >
                    +
                </button>
            </div>

            {/* Total Price */}
            <div className="flex flex-row justify-center mb-4">
                <h3 className="text-lg font-medium">
                    Total Price: {Number(selected.price) * quantity} ฿
                </h3>
            </div>

            {/* Add to Cart Or Buy Now */}
            <div className="flex justify-center">
                <button
                    type="button"
                    className="mx-2 px-6 py-3 bg-gray-400 text-white rounded hover:bg-green-700"
                    onClick={() => onAddToCart(selected, quantity)}
                >
                    Add To Cart
                </button>

                <button
                    type="button"
                    className="mx-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => onAddToCart(selected, quantity, true)}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}
