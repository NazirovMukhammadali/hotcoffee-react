import React from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";

export default function Advertisement() {
  return (
    <section className="story">
      <video className="story-video" autoPlay loop muted playsInline preload="metadata" poster="/img/hero.jpg">
        <source type="video/mp4" src="/video/hotcoffee.mp4" />
      </video>
      <div className="story-overlay" />
      <Container className="story-inner">
        <span className="eyebrow">Our craft</span>
        <h2>Every cup is pulled by hand.</h2>
        <p>
          We dial in our espresso every morning, steam milk to order and bake in small batches — because good coffee is
          worth the extra minute.
        </p>
        <Link to="/products" className="btn btn-primary">
          Order your cup
        </Link>
      </Container>
    </section>
  );
}
