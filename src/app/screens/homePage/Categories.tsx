import React from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { ProductCollection } from "../../../lib/enums/product.enum";

const categories = [
  { key: ProductCollection.COFFEE, title: "Coffee", text: "Espresso, lattes & cold brew", img: "/img/categories/coffee.jpg" },
  { key: ProductCollection.SMOOTHIE, title: "Smoothies", text: "Fresh fruit, blended to order", img: "/img/categories/smoothie.jpg" },
  { key: ProductCollection.DESSERTS, title: "Desserts", text: "Cheesecakes, mousse & macarons", img: "/img/categories/desserts.jpg" },
  { key: ProductCollection.SNACKS, title: "Snacks", text: "Pastries, cookies & toasts", img: "/img/categories/snacks.jpg" },
];

export default function Categories() {
  return (
    <section className="section categories-section">
      <Container>
        <div className="section-head">
          <div>
            <span className="eyebrow">Our menu</span>
            <h2 className="section-title">Something for every moment</h2>
          </div>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link key={category.key} to={`/products?collection=${category.key}`} className="category-card">
              <img src={category.img} alt="" loading="lazy" />
              <div className="category-card-body">
                <h3>{category.title}</h3>
                <p>{category.text}</p>
                <span className="category-card-link">
                  Order now <ArrowForwardRoundedIcon fontSize="small" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
