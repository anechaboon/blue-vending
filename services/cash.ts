const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCashes(queryStr: string = "") {
    const res = await fetch(`${BASE_API_URL}/cash` + queryStr, {
    method: "GET",
    cache: "no-store", // Ensure fresh data on each request
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cashes");
  }

  const data = await res.json();
  return data.data;
}

export async function createCash(formData: FormData) {
  const res = await fetch(`${BASE_API_URL}/cash`, {
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
  const res = await fetch(`${BASE_API_URL}/cash/${id}`, {
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
  const res = await fetch(`${BASE_API_URL}/cash/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete cash");
  }

    const data = await res.json();
    return data;
}