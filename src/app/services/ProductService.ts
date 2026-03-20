import axios from "axios"
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";
import { ProductCollection } from "../../lib/enums/product.enum";

class ProductService {
    private readonly path: string;

    constructor() {
        this.path = serverApi
    }

    private mapCollectionToBackend(collection?: ProductCollection): string | undefined {
        if (!collection || collection === ProductCollection.ALL) return undefined;
        return collection;
    }

    private mapCollectionFromBackend(collection?: string): ProductCollection {
        const normalized = String(collection || "").trim().toUpperCase();
        const mapping: Record<string, ProductCollection> = {
            COFFEE: ProductCollection.COFFEE,
            SMOOTHIE: ProductCollection.SMOOTHIE,
            DESSERTS: ProductCollection.DESSERTS,
            SNACKS: ProductCollection.SNACKS,
            ALL: ProductCollection.ALL,
        };
        return mapping[normalized] ?? ProductCollection.ALL;
    }

    private normalizeProduct(product: Product): Product {
        return {
            ...product,
            productCollection: this.mapCollectionFromBackend(
                String(product.productCollection)
            ),
        };
    }

    public async getProducts(input: ProductInquiry): Promise<Product[]> {
        try {
            const backendCollection = this.mapCollectionToBackend(
                input.productCollection
            );
            let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
            if (backendCollection) url += `&productCollection=${backendCollection}`;
            if (input.search) url += `&search=${input.search}`;

            const result = await axios.get(url);
            console.log("getProducts:", result);

            return result.data.map((product: Product) =>
                this.normalizeProduct(product)
            );
        } catch (err) {
            console.log("Error , getProduct:", err)
            throw err;
        }
    }

      public async getProduct(productId: string): Promise<Product> {
        try {
          const url = `${this.path}/product/${productId}`;
          const result = await axios.get(url, {withCredentials: true});
    
          return this.normalizeProduct(result.data);
        } catch (err) {
          console.log("Error, getProduct: ", err);
          throw err;
        }
      }
}

export default ProductService;