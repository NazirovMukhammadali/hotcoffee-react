import React from "react";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import { retrieveNewDishes } from "./selector";
import ProductCard from "../../components/common/ProductCard";

const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({ newDishes }));

export default function NewDishes(props: { onAdd: (item: CartItem) => void }) {
  const { newDishes } = useSelector(newDishesRetriever);
  return (
    <section className="section">
      <Container>
        <div className="section-head">
          <div>
            <span className="eyebrow">Just landed</span>
            <h2 className="section-title">New on the menu</h2>
            <p className="section-sub">Recently added drinks from our baristas.</p>
          </div>
        </div>
        <div className="product-grid">
          {newDishes.length !== 0 ? (
            newDishes.map((product: Product) => (
              <ProductCard key={product._id} product={product} onAdd={props.onAdd} showCategory={false} />
            ))
          ) : (
            <div className="empty">
              <h3>New drinks are on their way</h3>
              <p>Our baristas are working on something special.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
