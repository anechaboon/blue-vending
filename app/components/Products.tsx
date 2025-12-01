// app/components/Products.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/services/product';

interface Product {
  id: number | string;
  title: string;
  stock: string;
  price: string;
  image: string | File;
}

const BASE_URL_IMAGE = process.env.NEXT_PUBLIC_IMAGE_URL;

export default function Products({ onClickProduct }: { onClickProduct: (p: Product) => void }) {
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((products) => setProductList(products));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto">
      {productList.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden buy-product cursor-pointer"
          onClick={() => onClickProduct(product)}
        >
          <img
            src={`${BASE_URL_IMAGE}/products/${product.image}`}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
            <div className="flex flex-row justify-between mb-4 px-4 pt-3"> {/* row */}
              <h2 className="text-2xl font-bold flex-grow basis-0" style={{ flex: '0 0 75%' }}>{product.title}</h2>
              <h2 className="text-2xl font-bold flex-shrink-0 text-right" style={{ flex: '0 0 25%' }}>{product.price} ฿</h2>
            </div>
        </div>
      ))}
    </div>
  );
}
