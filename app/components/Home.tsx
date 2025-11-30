'use client';
import React, { useState } from 'react';
import Products from '@/app/components/Products';
import CommonModal from '@/app/components/CommonModal';
import BuyProductModalComp from '@/app/components/BuyProduct';
import CartItemsModalComp from '@/app/components/CartItemModalComp';
import { Product } from '@/app/interface/Product';


export default function Home() {
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openCartModal, setOpenCartModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<Product[]>([]);

    const handleAddToCart = (product: Product, quantity: number) => {
        if (quantity <= 0) return;
        setCart(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.map(p =>
                    p.id === product.id
                        ? { ...p, qty: (p.qty ?? 0) + quantity }
                        : p
                );
            }

            return [...prev, { ...product, qty: quantity }];
        });

        setOpenProductModal(false);
    };

    React.useEffect(() => {
        console.log('log:cart updated ->', cart);
    }, [cart]);


    const handleClickProduct = (product: Product) => {
        setSelectedProduct(product);
        setOpenProductModal(true);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">

            <div className="container">
                <div className="flex flex-row items-center justify-center w-full mb-8">
                    <h1 className="text-4xl font-bold flex-1 text-center">Blue - Vending</h1>
                    <h2 className="text-2xl font-semibold" onClick={() => setOpenCartModal(true)}>Cart Items: {cart.length}</h2>
                </div>
            </div>
            
            <Products onClickProduct={handleClickProduct}  />
            <CommonModal
                title=""
                width="600px"
                open={openProductModal}
                onClose={() => setOpenProductModal(false)}
                footer={
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() => setOpenProductModal(false)}
                    >
                    Cancel
                    </button>
                </div>
                }
            >
                {selectedProduct && (
                    <BuyProductModalComp
                        selected={selectedProduct}
                        onAddToCart={handleAddToCart}
                    />
                )}
            </CommonModal>

            {/* Show Items in Cart */}
            <CommonModal
                title="Cart Items"
                width="600px"
                open={openCartModal}
                onClose={() => setOpenCartModal(false)}
                footer={
                <div className="flex justify-between gap-3">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() => setOpenCartModal(false)}
                    >
                        Close
                    </button>

                    <button
                        className="px-4 py-2 bg-green-700 text-white rounded"
                    >
                        Checkout
                    </button>
                </div>

                }
            >
                <CartItemsModalComp cart={cart} />
            </CommonModal>  
        </main>
    );
}
