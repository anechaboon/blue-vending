// services/api.ts
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function purchase(formData: FormData) {
    const res = await fetch(`${BASE_API_URL}/purchase`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to create product");
    }

    const data = await res.json();
    return data;
}