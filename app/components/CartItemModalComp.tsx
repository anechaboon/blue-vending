import { Product } from '@/app/interface/Product';

export default function CartItemsModalComp({ cart, onUpdateQuantity }: { cart: Product[], onUpdateQuantity: (id: number, qty: number) => void }) {
    
    return (
        <div>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    <li>
                        <div className="flex flex-row items-center justify-center w-full mb-8 font-bold">
                            <div className="flex-2">Product</div>
                            <div className="flex-1">Price</div>
                            <div className="flex-1">Quantity</div>
                            <div>Total</div>
                        </div>
                    </li>
                    {cart.map((item) => (
                        <li key={item.id} className="mb-4">
                            <div className="flex flex-row items-center justify-center w-full mb-4">
                                <div className="flex flex-row items-center flex-2">
                                    <div
                                        className="w-16 h-16 bg-gray-200 bg-center bg-contain mr-4"
                                        style={{
                                            backgroundImage: item.image
                                                ? `url(${process.env.NEXT_PUBLIC_IMAGE_URL}/products/${item.image})`
                                                : undefined,
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    ></div>
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                </div>
                                <div className="flex-1 ">
                                    <span className="text-gray-600 ">{item.price} ฿</span>
                                </div>
                                <div className="flex-1">
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded mr-2 hover:cursor-pointer"
                                        onClick={() => onUpdateQuantity(Number(item.id), (item.qty ?? 0) - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="text-gray-600">{item.qty}</span>
                                    <button
                                        className="px-2 py-1 bg-green-600 text-white rounded ml-2 hover:cursor-pointer"
                                        onClick={() => onUpdateQuantity(Number(item.id), (item.qty ?? 0) + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-semibold">{(item.qty ?? 0) * parseFloat(item.price)} ฿</span>
                                </div>
                            </div>
                        </li>
                    ))}
                    <li>
                        <div className="flex flex-row items-center justify-end w-full font-bold">
                            <div className="mr-4">Grand Total:</div>
                            <div>
                                <span className="text-gray-800 font-semibold">
                                    {cart.reduce((total, item) => total + (item.qty ?? 0) * parseFloat(item.price), 0)} ฿
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
}