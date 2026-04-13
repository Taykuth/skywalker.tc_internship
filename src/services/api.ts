import type { Product, GeneratedImage } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// -- Görselleri getir (üretim tamamlanmış ürünler) --
export async function fetchGeneratedProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/images/generated`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Ürünler yüklenemedi");
  return res.json();
}

// -- Görsel durumunu güncelle (onayla / reddet) --
export async function updateImageStatus(
  imageId: string,
  status: "approved" | "rejected"
): Promise<GeneratedImage> {
  const res = await fetch(`${API_BASE}/images/${imageId}/${status === "approved" ? "approve" : "reject"}`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Durum güncellenemedi");
  return res.json();
}

// -- Yeniden üret --
export async function regenerateImage(imageId: string): Promise<GeneratedImage> {
  const res = await fetch(`${API_BASE}/generation/regenerate/${imageId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Yeniden üretim başlatılamadı");
  return res.json();
}

// -- Tek görsel indir --
export async function downloadSingleImage(imageId: string): Promise<Blob> {
  const res = await fetch(`${API_BASE}/images/${imageId}/download`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Görsel indirilemedi");
  return res.blob();
}

// -- Toplu ZIP indir --
export async function downloadZip(): Promise<Blob> {
  const res = await fetch(`${API_BASE}/images/download-zip`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("ZIP indirilemedi");
  return res.blob();
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
