import React from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useGlobals } from "../../hooks/useGlobals";
import { SITE } from "../../../lib/data/site";

interface HeroProps {
  setAuthOpen: (isOpen: boolean) => void;
}

export default function Hero(props: HeroProps) {
  const { authMember } = useGlobals();

  return (
    <section className="hero" style={{ backgroundImage: "url(/img/hero.jpg)" }}>
      <Container className="hero-inner">
        <span className="eyebrow">Specialty coffee · Tashkent</span>
        <h1>
          Fresh, slow-roasted coffee <em>for every morning.</em>
        </h1>
        <p>
          Hand-pulled espresso, silky lattes, fresh pastries and smoothies — order ahead and pick up your favourite
          without the queue.
        </p>
        <div className="hero-cta">
          <Link to="/products" className="btn btn-primary">
            Explore the menu <ArrowForwardRoundedIcon />
          </Link>
          {!authMember ? (
            <button type="button" className="btn btn-light" onClick={() => props.setAuthOpen(true)}>
              Join &amp; earn points
            </button>
          ) : (
            <Link to="/orders" className="btn btn-light">
              My orders
            </Link>
          )}
        </div>
        <div className="hero-meta">
          <div>
            <strong>{SITE.hours[0].time}</strong>
            <span>Open every day</span>
          </div>
          <div>
            <strong>10–15 min</strong>
            <span>Average order time</span>
          </div>
          <div>
            <strong>${SITE.freeDeliveryFrom}+</strong>
            <span>Free delivery</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
