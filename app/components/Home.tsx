'use client';
import React, { useState } from 'react';
import Products from '@/app/components/Products';
import CommonModal from '@/app/components/CommonModal';
import BuyProductModalComp from '@/app/components/BuyProduct';
import CartItemsModalComp from '@/app/components/CartItemModalComp';
import PaymentModalComp from '@/app/components/PaymentModalComp';
import { Product } from '@/app/interface/Product';
import Swal from 'sweetalert2';
import { purchase } from '@/services/api';

export default function Home() {
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openCartModal, setOpenCartModal] = useState(false);
    const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<Product[]>([]);

    const [billReceived, setBillReceived] = React.useState<Record<string, number>>({});
    const [coinReceived, setCoinReceived] = React.useState<Record<string, number>>({});
    const [totalInserted, setTotalInserted] = React.useState<number>(0);
    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * (item.qty ?? 0)), 0);

    const handleAddToCart = (product: Product, quantity: number, buy_now: boolean = false) => {
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
        if (buy_now) {
            setOpenCheckoutModal(true);
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: `Added ${quantity} of "${product.title}" to cart.`,
            });
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cart is empty',
                text: 'Please add items to your cart before checking out.',
            });
            return;
        }

        setOpenCartModal(false);
        setOpenCheckoutModal(true);
    };

    const handleClickProduct = (product: Product) => {
        setSelectedProduct(product);
        setOpenProductModal(true);
    };

    const handleConfirmPayment = () => {
        const res = cart.map(item => ({
            id: item.id,
            quantity: item.qty ?? 0
        }));

        const formData = new FormData();
        formData.append('product', JSON.stringify(res));
        formData.append('BILL', JSON.stringify(billReceived));
        formData.append('COIN', JSON.stringify(coinReceived));

        purchase(formData).then((response) => {
            if (!response.status) {
                Swal.fire('Error', response.message || 'Payment failed', 'error');
                return;
            }

            Swal.fire('Success', 'Payment successful!', 'success').then(() => {
                // Reset everything
                setCart([]);
                setBillReceived({});
                setCoinReceived({});
                setTotalInserted(0);
                setOpenCheckoutModal(false);
            });
        }).catch((error) => {
            console.log('Error:', error);
            Swal.fire('Error', 'An error occurred during payment', 'error');
        });
    }

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Item Removed',
                text: 'The item has been removed from your cart.',
                showConfirmButton: true,
                showCancelButton: true,
            }).then((res) => {
                if (res.isConfirmed) {
                    setCart(prev => prev.filter(i => i.id !== productId));
                }
            });
            return;
        }
        
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, qty: newQuantity } : item
        ));
    };

    const closePaymentModal = () => {
        setOpenCheckoutModal(false);
        setBillReceived({});
        setCoinReceived({});
        setTotalInserted(0);
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-300">

            <div className="container">
                <div className="flex flex-row items-center justify-center w-full mb-8">
                    <h1 className="text-4xl font-bold flex-1 text-center">Blue - Vending</h1>
                    <h2 className="text-2xl font-semibold hover:cursor-pointer" onClick={() => setOpenCartModal(true)}>Cart Items: {cart.length}</h2>
                </div>
            </div>
            
            <Products onClickProduct={handleClickProduct}  />

            {/* Buy Product Modal */}
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
                        className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer"
                        onClick={() => setOpenCartModal(false)}
                    >
                        Close
                    </button>

                    <button
                        className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                        disabled={cart.length === 0}
                        onClick={() => handleCheckout()}
                    >
                        Checkout
                    </button>
                </div>

                }
            >
                <CartItemsModalComp cart={cart} onUpdateQuantity={handleUpdateQuantity}  />
            </CommonModal> 

            {/* Checkout Modal */}
            <CommonModal
                title="Checkout"
                width="600px"
                open={openCheckoutModal}
                onClose={() => closePaymentModal()}
                footer={
                <div className="flex justify-between gap-3">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer"
                        onClick={() => closePaymentModal()}
                    >
                        Close
                    </button>

                    <button
                        className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                        onClick={() => handleConfirmPayment()}
                        disabled={totalInserted < totalAmount}
                    >
                        Confirm Payment
                    </button>
                </div>
                }
            >
                <PaymentModalComp 
                    cart={cart}
                    totalAmount={totalAmount}
                    billReceived={billReceived}
                    coinReceived={coinReceived}
                    setBillReceived={setBillReceived}
                    setCoinReceived={setCoinReceived}
                    totalInserted={totalInserted}
                    setTotalInserted={setTotalInserted}
                    />
            </CommonModal> 
        </main>
    );
}
