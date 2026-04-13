"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product, GeneratedImage } from "@/types";

interface ImagePreviewCardProps {
  product: Product;
  onApprove: (imageId: string) => void;
  onReject: (imageId: string) => void;
  onRegenerate: (imageId: string) => void;
  onDownload: (imageId: string, fileName: string) => void;
  onZoom: (imageUrl: string) => void;
}

const statusConfig = {
  pending: { label: "Bekliyor", variant: "secondary" as const },
  approved: { label: "Onaylandı", variant: "default" as const },
  rejected: { label: "Reddedildi", variant: "destructive" as const },
};

export default function ImagePreviewCard({
  product,
  onApprove,
  onReject,
  onRegenerate,
  onDownload,
  onZoom,
}: ImagePreviewCardProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (action: () => void, imageId: string) => {
    setLoadingId(imageId);
    try {
      action();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="truncate">{product.name}</span>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {product.category}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Barkod: {product.barcode}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
          {/* Orijinal Görsel */}
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Orijinal</p>
            <div
              className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-zoom-in border"
              onClick={() => onZoom(product.originalImageUrl)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.originalImageUrl}
                alt={`${product.name} - orijinal`}
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                <span className="text-transparent hover:text-white text-sm">Büyüt</span>
              </div>
            </div>
          </div>

          {/* Üretilen Görseller (Varyantlar) */}
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">
              Üretilen Görseller ({product.generatedImages.length} varyant)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {product.generatedImages.map((img) => (
                <GeneratedImageVariant
                  key={img.id}
                  image={img}
                  productName={product.name}
                  isLoading={loadingId === img.id}
                  onApprove={() => handleAction(() => onApprove(img.id), img.id)}
                  onReject={() => handleAction(() => onReject(img.id), img.id)}
                  onRegenerate={() => handleAction(() => onRegenerate(img.id), img.id)}
                  onDownload={() => onDownload(img.id, `${product.barcode}_${img.id}.png`)}
                  onZoom={() => onZoom(img.generatedUrl)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GeneratedImageVariant({
  image,
  productName,
  isLoading,
  onApprove,
  onReject,
  onRegenerate,
  onDownload,
  onZoom,
}: {
  image: GeneratedImage;
  productName: string;
  isLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onZoom: () => void;
}) {
  const status = statusConfig[image.status];

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Görsel */}
      <div
        className="relative aspect-square bg-muted cursor-zoom-in"
        onClick={onZoom}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.generatedUrl}
          alt={`${productName} - üretilen`}
          className="w-full h-full object-contain p-1"
        />
        <Badge
          variant={status.variant}
          className="absolute top-2 right-2"
        >
          {status.label}
        </Badge>
      </div>

      {/* Butonlar */}
      <div className="p-2 space-y-2">
        <p className="text-xs text-muted-foreground text-center">
          {image.mode === "virtual_model" ? "AI Model" : "Arka Plan"}
        </p>

        {image.status === "pending" && (
          <div className="flex gap-1">
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={onApprove}
              disabled={isLoading}
            >
              Onayla
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={onReject}
              disabled={isLoading}
            >
              Reddet
            </Button>
          </div>
        )}

        {image.status === "approved" && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={onDownload}
          >
            İndir
          </Button>
        )}

        {image.status === "rejected" && (
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            Yeniden Üret
          </Button>
        )}
      </div>
    </div>
  );
}
