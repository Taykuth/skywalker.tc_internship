"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageZoomModalProps {
  imageUrl: string | null;
  alt?: string;
  onClose: () => void;
}

export default function ImageZoomModal({ imageUrl, alt, onClose }: ImageZoomModalProps) {
  return (
    <Dialog open={!!imageUrl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
        <DialogTitle className="sr-only">Görsel Önizleme</DialogTitle>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={alt || "Büyütülmüş görsel"}
            className="w-full h-full max-h-[85vh] object-contain rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
