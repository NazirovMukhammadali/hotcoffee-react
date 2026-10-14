import React from "react";
import { useHistory } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import { collectionLabels, imageUrl, money, productServing } from "../../../lib/format";

interface ProductCardProps {
  product: Product;
  onAdd?: (item: CartItem) => void;
  showCategory?: boolean;
}

export default function ProductCard(props: ProductCardProps) {
  const { product, onAdd, showCategory = true } = props;
  const history = useHistory();
  const soldOut = product.productLeftCount <= 0;

  return (
    <article className="p-card" onClick={() => history.push(`/products/${product._id}`)}>
      <div className="p-card-media">
        <img src={imageUrl(product.productImages[0], "/icons/noimage-list.svg")} alt={product.productName} loading="lazy" />
        {showCategory && (
          <span className="p-card-tag">{collectionLabels[product.productCollection] ?? product.productCollection}</span>
        )}
        <span className="p-card-views" title="Views">
          <VisibilityOutlinedIcon /> {product.productViews}
        </span>
      </div>
      <div className="p-card-body">
        <h3 className="p-card-title">{product.productName}</h3>
        <p className="p-card-desc">{product.productDesc}</p>
        <div className="p-card-foot">
          <div>
            <span className="price">{money(product.productPrice)}</span>
            <span className="p-card-serving"> · {soldOut ? "Sold out" : productServing(product)}</span>
          </div>
          {onAdd && (
            <button
              type="button"
              className="add-btn"
              aria-label={`Add ${product.productName} to basket`}
              disabled={soldOut}
              onClick={(e) => {
                e.stopPropagation();
                onAdd({
                  _id: product._id,
                  quantity: 1,
                  name: product.productName,
                  price: product.productPrice,
                  image: product.productImages[0],
                });
              }}
            >
              <AddRoundedIcon />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
