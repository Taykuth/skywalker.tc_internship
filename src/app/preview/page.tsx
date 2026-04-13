"use client";

import { useState, useEffect, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImagePreviewCard from "@/components/ImagePreviewCard";
import ImageZoomModal from "@/components/ImageZoomModal";
import type { Product, GeneratedImage } from "@/types";
import {
  fetchGeneratedProducts,
  updateImageStatus,
  regenerateImage,
  downloadSingleImage,
  downloadZip,
} from "@/services/api";

// -- Demo verisi (backend bağlanana kadar) --
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    barcode: "8680001234567",
    name: "Kadın Oversize Beyaz T-Shirt",
    category: "Giyim",
    originalImageUrl: "https://placehold.co/600x800/e2e8f0/475569?text=T-Shirt+Orijinal",
    generatedImages: [
      {
        id: "img-1a",
        productId: "1",
        originalUrl: "https://placehold.co/600x800/e2e8f0/475569?text=T-Shirt+Orijinal",
        generatedUrl: "https://placehold.co/600x800/fef3c7/92400e?text=Model+Poz+1",
        status: "pending",
        mode: "virtual_model",
        createdAt: "2026-04-13T10:00:00Z",
      },
      {
        id: "img-1b",
        productId: "1",
        originalUrl: "https://placehold.co/600x800/e2e8f0/475569?text=T-Shirt+Orijinal",
        generatedUrl: "https://placehold.co/600x800/dbeafe/1e40af?text=Model+Poz+2",
        status: "pending",
        mode: "virtual_model",
        createdAt: "2026-04-13T10:00:01Z",
      },
      {
        id: "img-1c",
        productId: "1",
        originalUrl: "https://placehold.co/600x800/e2e8f0/475569?text=T-Shirt+Orijinal",
        generatedUrl: "https://placehold.co/600x800/dcfce7/166534?text=Model+Poz+3",
        status: "pending",
        mode: "virtual_model",
        createdAt: "2026-04-13T10:00:02Z",
      },
    ],
  },
  {
    id: "2",
    barcode: "8680009876543",
    name: "Deri Siyah El Çantası",
    category: "Aksesuar",
    originalImageUrl: "https://placehold.co/600x600/f1f5f9/334155?text=Canta+Orijinal",
    generatedImages: [
      {
        id: "img-2a",
        productId: "2",
        originalUrl: "https://placehold.co/600x600/f1f5f9/334155?text=Canta+Orijinal",
        generatedUrl: "https://placehold.co/600x600/fce7f3/9d174d?text=Arka+Plan+1",
        status: "pending",
        mode: "background",
        createdAt: "2026-04-13T10:01:00Z",
      },
      {
        id: "img-2b",
        productId: "2",
        originalUrl: "https://placehold.co/600x600/f1f5f9/334155?text=Canta+Orijinal",
        generatedUrl: "https://placehold.co/600x600/ede9fe/5b21b6?text=Arka+Plan+2",
        status: "pending",
        mode: "background",
        createdAt: "2026-04-13T10:01:01Z",
      },
    ],
  },
  {
    id: "3",
    barcode: "8680005555555",
    name: "Erkek Slim Fit Lacivert Gömlek",
    category: "Giyim",
    originalImageUrl: "https://placehold.co/600x800/e0f2fe/0c4a6e?text=Gomlek+Orijinal",
    generatedImages: [
      {
        id: "img-3a",
        productId: "3",
        originalUrl: "https://placehold.co/600x800/e0f2fe/0c4a6e?text=Gomlek+Orijinal",
        generatedUrl: "https://placehold.co/600x800/fff7ed/9a3412?text=Model+Ayakta",
        status: "pending",
        mode: "virtual_model",
        createdAt: "2026-04-13T10:02:00Z",
      },
      {
        id: "img-3b",
        productId: "3",
        originalUrl: "https://placehold.co/600x800/e0f2fe/0c4a6e?text=Gomlek+Orijinal",
        generatedUrl: "https://placehold.co/600x800/f0fdf4/166534?text=Model+Yuruyus",
        status: "pending",
        mode: "virtual_model",
        createdAt: "2026-04-13T10:02:01Z",
      },
    ],
  },
  {
    id: "4",
    barcode: "8680007777777",
    name: "Kablosuz Bluetooth Kulaklık",
    category: "Elektronik",
    originalImageUrl: "https://placehold.co/600x600/f8fafc/1e293b?text=Kulaklik+Orijinal",
    generatedImages: [
      {
        id: "img-4a",
        productId: "4",
        originalUrl: "https://placehold.co/600x600/f8fafc/1e293b?text=Kulaklik+Orijinal",
        generatedUrl: "https://placehold.co/600x600/ecfdf5/065f46?text=Arka+Plan+Studio",
        status: "pending",
        mode: "background",
        createdAt: "2026-04-13T10:03:00Z",
      },
      {
        id: "img-4b",
        productId: "4",
        originalUrl: "https://placehold.co/600x600/f8fafc/1e293b?text=Kulaklik+Orijinal",
        generatedUrl: "https://placehold.co/600x600/fef2f2/991b1b?text=Arka+Plan+Minimal",
        status: "pending",
        mode: "background",
        createdAt: "2026-04-13T10:03:01Z",
      },
    ],
  },
];

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function PreviewPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [useDemoMode] = useState(true); // backend bağlanınca false yap

  // Backend'den veri çek
  useEffect(() => {
    if (!useDemoMode) {
      fetchGeneratedProducts()
        .then(setProducts)
        .catch(console.error);
    }
  }, [useDemoMode]);

  // -- Onayla --
  const handleApprove = useCallback(
    async (imageId: string) => {
      if (!useDemoMode) {
        await updateImageStatus(imageId, "approved");
      }
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          generatedImages: p.generatedImages.map((img) =>
            img.id === imageId ? { ...img, status: "approved" as const } : img
          ),
        }))
      );
    },
    [useDemoMode]
  );

  // -- Reddet --
  const handleReject = useCallback(
    async (imageId: string) => {
      if (!useDemoMode) {
        await updateImageStatus(imageId, "rejected");
      }
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          generatedImages: p.generatedImages.map((img) =>
            img.id === imageId ? { ...img, status: "rejected" as const } : img
          ),
        }))
      );
    },
    [useDemoMode]
  );

  // -- Yeniden Üret --
  const handleRegenerate = useCallback(
    async (imageId: string) => {
      if (!useDemoMode) {
        const newImage = await regenerateImage(imageId);
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            generatedImages: p.generatedImages.map((img) =>
              img.id === imageId ? newImage : img
            ),
          }))
        );
      } else {
        // Demo modda: durumu pending'e çevir, URL'yi değiştir
        setProducts((prev) =>
          prev.map((p) => ({
            ...p,
            generatedImages: p.generatedImages.map((img) =>
              img.id === imageId
                ? {
                    ...img,
                    status: "pending" as const,
                    generatedUrl: img.generatedUrl.replace(
                      /text=.*/,
                      `text=Yeni+Varyant+${Date.now() % 1000}`
                    ),
                  }
                : img
            ),
          }))
        );
      }
    },
    [useDemoMode]
  );

  // -- Tek görsel indir --
  const handleDownloadSingle = useCallback(
    async (imageId: string, fileName: string) => {
      if (!useDemoMode) {
        const blob = await downloadSingleImage(imageId);
        saveAs(blob, fileName);
      } else {
        // Demo modda: placeholder görseli indir
        const image = products
          .flatMap((p) => p.generatedImages)
          .find((img) => img.id === imageId);
        if (image) {
          const response = await fetch(image.generatedUrl);
          const blob = await response.blob();
          saveAs(blob, fileName);
        }
      }
    },
    [useDemoMode, products]
  );

  // -- Toplu ZIP indir --
  const handleDownloadZip = useCallback(async () => {
    setIsDownloadingZip(true);
    try {
      if (!useDemoMode) {
        const blob = await downloadZip();
        saveAs(blob, "onaylanan-gorseller.zip");
      } else {
        // Demo modda: onaylı görselleri JSZip ile ZIP'e paketleyip indir
        const zip = new JSZip();
        const approvedImages = products.flatMap((p) =>
          p.generatedImages
            .filter((img) => img.status === "approved")
            .map((img) => ({ ...img, barcode: p.barcode, productName: p.name }))
        );

        for (const img of approvedImages) {
          try {
            const response = await fetch(img.generatedUrl);
            const blob = await response.blob();
            zip.file(`${img.barcode}_${img.id}.png`, blob);
          } catch {
            console.error(`Görsel indirilemedi: ${img.id}`);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "onaylanan-gorseller.zip");
      }
    } finally {
      setIsDownloadingZip(false);
    }
  }, [useDemoMode, products]);

  // -- İstatistikler --
  const allImages = products.flatMap((p) => p.generatedImages);
  const counts = {
    total: allImages.length,
    pending: allImages.filter((i) => i.status === "pending").length,
    approved: allImages.filter((i) => i.status === "approved").length,
    rejected: allImages.filter((i) => i.status === "rejected").length,
  };

  // -- Filtreleme --
  const filteredProducts =
    filter === "all"
      ? products
      : products
          .map((p) => ({
            ...p,
            generatedImages: p.generatedImages.filter((img) => img.status === filter),
          }))
          .filter((p) => p.generatedImages.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Görsel Önizleme ve Onay</h1>
            <p className="text-sm text-muted-foreground">
              Üretilen görselleri inceleyin, onaylayın veya reddedin
            </p>
          </div>

          <Button
            onClick={handleDownloadZip}
            disabled={counts.approved === 0 || isDownloadingZip}
            className="shrink-0"
          >
            {isDownloadingZip
              ? "ZIP Hazırlanıyor..."
              : `Tüm Onaylı Görselleri İndir (${counts.approved})`}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* İstatistik Çubuğu */}
        <div className="flex flex-wrap gap-2">
          <FilterBadge
            label={`Tümü (${counts.total})`}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterBadge
            label={`Bekleyen (${counts.pending})`}
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
            color="secondary"
          />
          <FilterBadge
            label={`Onaylı (${counts.approved})`}
            active={filter === "approved"}
            onClick={() => setFilter("approved")}
            color="green"
          />
          <FilterBadge
            label={`Reddedilen (${counts.rejected})`}
            active={filter === "rejected"}
            onClick={() => setFilter("rejected")}
            color="red"
          />
        </div>

        {/* Ürün Kartları */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Bu filtrede gösterilecek görsel bulunmuyor.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <ImagePreviewCard
                key={product.id}
                product={product}
                onApprove={handleApprove}
                onReject={handleReject}
                onRegenerate={handleRegenerate}
                onDownload={handleDownloadSingle}
                onZoom={setZoomImage}
              />
            ))}
          </div>
        )}
      </main>

      {/* Zoom Modal */}
      <ImageZoomModal
        imageUrl={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}

function FilterBadge({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: "secondary" | "green" | "red";
}) {
  const colorClasses = active
    ? color === "green"
      ? "bg-green-600 text-white hover:bg-green-700"
      : color === "red"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-primary text-primary-foreground"
    : "bg-muted text-muted-foreground hover:bg-muted/80";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${colorClasses}`}
    >
      {label}
    </button>
  );
}
