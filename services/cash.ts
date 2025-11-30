const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCashes(q: string = "") {
    const res = await fetch(`${BASE_URL}/cash` + q, {
        method: "GET",
        cache: "no-store", // ป้องกันแคช (จำเป็นถ้าเปลี่ยนบ่อย)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data.data;
}