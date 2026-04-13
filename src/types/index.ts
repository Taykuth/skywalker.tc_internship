export type ImageStatus = "pending" | "approved" | "rejected";

export interface GeneratedImage {
  id: string;
  productId: string;
  originalUrl: string;
  generatedUrl: string;
  status: ImageStatus;
  mode: "background" | "virtual_model";
  createdAt: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  originalImageUrl: string;
  generatedImages: GeneratedImage[];
}
