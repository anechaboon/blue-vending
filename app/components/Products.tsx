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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
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
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {product.title}
            </h2>
            <p className="text-gray-600">{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
