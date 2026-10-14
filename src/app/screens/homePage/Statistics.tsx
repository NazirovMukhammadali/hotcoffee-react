import React from "react";
import { Container } from "@mui/material";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import BakeryDiningOutlinedIcon from "@mui/icons-material/BakeryDiningOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";

interface StatisticsProps {
  menuCount: number;
}

/** "Nega HotCoffee" — faqat haqiqiy ma'lumotlar (menyu soni API'dan) */
export default function Statistics(props: StatisticsProps) {
  const items = [
    {
      icon: <LocalCafeOutlinedIcon />,
      title: props.menuCount ? `${props.menuCount} items on the menu` : "A full coffee menu",
      text: "Espresso classics, iced drinks, smoothies, desserts and snacks.",
    },
    {
      icon: <SpaOutlinedIcon />,
      title: "Roasted every week",
      text: "Small-batch beans, so every cup tastes fresh and balanced.",
    },
    {
      icon: <BakeryDiningOutlinedIcon />,
      title: "Baked this morning",
      text: "Croissants, cookies and cinnamon rolls straight from our oven.",
    },
    {
      icon: <DeliveryDiningOutlinedIcon />,
      title: "Free delivery from $100",
      text: "Otherwise just $5 anywhere in the city.",
    },
  ];

  return (
    <section className="features">
      <Container>
        <div className="features-grid">
          {items.map((item) => (
            <div className="feature" key={item.title}>
              <span className="feature-icon">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
