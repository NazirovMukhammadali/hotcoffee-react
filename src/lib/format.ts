import { serverApi } from "./config";
import { ProductCollection, ProductSize } from "./enums/product.enum";
import { Product } from "./types/product";

export const money = (value: number | undefined | null) =>
    `$${Number(value ?? 0).toFixed(2)}`;

export const imageUrl = (path?: string, fallback = "/icons/default-user.svg") =>
    path ? `${serverApi}/${path}` : fallback;

export const collectionLabels: Record<string, string> = {
    [ProductCollection.COFFEE]: "Coffee",
    [ProductCollection.SMOOTHIE]: "Smoothies",
    [ProductCollection.DESSERTS]: "Desserts",
    [ProductCollection.SNACKS]: "Snacks",
    [ProductCollection.ALL]: "All",
};

const sizeLabels: Record<string, string> = {
    [ProductSize.SMALL]: "Small",
    [ProductSize.NORMAL]: "Regular",
    [ProductSize.LARGE]: "Large",
    [ProductSize.SET]: "Set",
};

/** Smoothie uchun hajm (litr), qolganlar uchun o'lcham */
export const productServing = (product: Product) =>
    product.productCollection === ProductCollection.SMOOTHIE
        ? `${product.productVolume} L`
        : sizeLabels[product.productSize] ?? product.productSize;
