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

export async function createCash(formData: FormData) {
    const res = await fetch(`${BASE_URL}/cash`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to create cash");
    }

    const data = await res.json();
    return data;
}

export async function updateCash(id: number, formData: FormData) {
    const res = await fetch(`${BASE_URL}/cash/${id}`, {
        method: "PUT",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Failed to update cash");
    }

    const data = await res.json();
    return data;
}

export async function deleteCash(id: number) {
    const res = await fetch(`${BASE_URL}/cash/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete cash");
    }

    const data = await res.json();
    return data;
}