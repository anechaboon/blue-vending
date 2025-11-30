
interface Product {
  id: number | string;
  title: string;
  stock: string;
  price: string;
  image: string | File;
}

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
export async function getProductList() {
  const res = await fetch(`${BASE_URL}/product`);
  // Next.js แคชข้อมูลนี้โดยอัตโนมัติ
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  if (!data.status) {
    throw new Error('Failed to fetch data');
  }
  return data.data;
}
export default async function Products() {
  const productList = await getProductList();
  return (
    <main className="flex flex-col items-center min-h-screen p-1 pt-6">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto">
        {productList.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`${BASE_URL}/products/${product.image}`}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {product.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
