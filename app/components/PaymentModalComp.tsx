import { Product } from '@/app/interface/Product';
import { Cash } from '@/app/interface/Cash';
import { getCashes } from '@/services/cash';
import React from 'react';
import Swal from 'sweetalert2';
export default function PaymentModalComp({
    cart,
    billReceived,
    coinReceived,
    setBillReceived,
    setCoinReceived,
    totalInserted,
    setTotalInserted
}: {
    cart: Product[],
    billReceived: Record<string, number>,
    coinReceived: Record<string, number>,
    setBillReceived: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    setCoinReceived: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    totalInserted: number,
    setTotalInserted: React.Dispatch<React.SetStateAction<number>>
}) {

    const [bills, setBills] = React.useState<Cash[]>([]);
    const [coins, setCoins] = React.useState<Cash[]>([]);

    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * (item.qty ?? 0)), 0);

    const handleInsert = (cash_type: string, cash: number) => {
        if (totalInserted >= totalAmount) {
            Swal.fire({
                icon: 'info',
                title: 'Sufficient Cash Inserted',
                text: 'You have already inserted enough cash for this transaction.',
            });
            return;
        }

        setTotalInserted(prev => prev + cash);

        if (cash_type === 'BILL') {
            setBillReceived(prev => {
                const key = `b${cash}`;
                return { ...prev, [key]: (prev[key] ?? 0) + 1 };
            });
        }

        if (cash_type === 'COIN') {
            setCoinReceived(prev => {
                const key = `c${cash}`;
                return { ...prev, [key]: (prev[key] ?? 0) + 1 };
            });
        }
    };

    React.useEffect(() => {
        getCashes('?cash_type=BILL').then((data) => setBills(data));
        getCashes('?cash_type=COIN').then((data) => setCoins(data));
    }, []);

    return (
        <div className="p-4">
            <div className="flex flex-row items-center justify-center w-full mb-8">
                <h4 className="text-2xl font-bold text-center">Insert Cash for </h4>
                <h2 className="text-4xl font-semibold pl-3">{totalAmount} ฿</h2>
            </div>
            <div className="flex flex-row items-center justify-center w-full mb-8">
                <h4 className="text-2xl font-bold text-center">Inserted</h4>
                <h2 className="text-4xl font-semibold pl-3">{totalInserted} ฿</h2>
            </div>

            <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                    {bills.map((bill) => (
                        <div key={bill.id} className="flex flex-row items-center p-4 border rounded-lg hover:shadow-md cursor-pointer"
                            onClick={() => handleInsert(bill.cash_type, bill.cash)}
                            >
                            <h3 className="text-lg font-semibold">{bill.cash_type} - {bill.cash}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="grid grid-cols-2 gap-4">
                    {coins.map((coin) => (
                        <div key={coin.id} className="flex flex-row items-center p-4 border rounded-lg hover:shadow-md cursor-pointer"
                            onClick={() => handleInsert(coin.cash_type, coin.cash)}
                            >
                            <h3 className="text-lg font-semibold">{coin.cash_type} - {coin.cash}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}