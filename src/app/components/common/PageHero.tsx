import React, { ReactNode } from "react";
import { Container } from "@mui/material";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  children?: ReactNode;
}

export default function PageHero(props: PageHeroProps) {
  const { eyebrow, title, subtitle, image = "/img/hero.jpg", children } = props;
  return (
    <header className="page-hero" style={{ backgroundImage: `url(${image})` }}>
      <Container>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </Container>
    </header>
  );
}
