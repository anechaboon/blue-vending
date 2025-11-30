const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
    const res = await fetch(`${BASE_URL}/product`, {
        method: "GET",
        cache: "no-store", // ป้องกันแคช (จำเป็นถ้าเปลี่ยนบ่อย)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data.data;
}

export async function createProduct(formData: FormData) {
    const res = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to create product");
    }

    const data = await res.json();
    return data;
}

export async function updateProduct(productId: number | string, formData: FormData) {
    const res = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "PUT",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to update product");
    }

    const data = await res.json();
    return data;
}

export async function deleteProduct(productId: number | string) {
    const res = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete product");
    }

    const data = await res.json();
    return data;
    
}
