import React from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductCard from "../../components/common/ProductCard";

/** REDUX SLICE & SELECTOR */
const popularDishesRetriever = createSelector(retrievePopularDishes, (popularDishes) => ({ popularDishes }));

export default function PopularDishes(props: { onAdd: (item: CartItem) => void }) {
  const { popularDishes } = useSelector(popularDishesRetriever);
  return (
    <section className="section">
      <Container>
        <div className="section-head">
          <div>
            <span className="eyebrow">Most loved</span>
            <h2 className="section-title">Hot picks this week</h2>
            <p className="section-sub">The coffees our guests come back for again and again.</p>
          </div>
          <Link to="/products" className="link-arrow">
            Full menu <ArrowForwardRoundedIcon fontSize="small" />
          </Link>
        </div>
        <div className="product-grid">
          {popularDishes.length !== 0 ? (
            popularDishes.map((product: Product) => (
              <ProductCard key={product._id} product={product} onAdd={props.onAdd} showCategory={false} />
            ))
          ) : (
            <div className="empty">
              <h3>Fresh picks are brewing</h3>
              <p>Check back in a moment.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
