import React from "react";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { useGlobals } from "../../hooks/useGlobals";
import BrandMark from "../common/BrandMark";
import { SITE } from "../../../lib/data/site";

const socialIcons: Record<string, JSX.Element> = {
  Instagram: <InstagramIcon />,
  Telegram: <TelegramIcon />,
  Facebook: <FacebookIcon />,
  YouTube: <YouTubeIcon />,
};

export default function Footer() {
  const { authMember } = useGlobals();

  return (
    <footer className="footer">
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="navbar-brand">
              <BrandMark size={38} />
              <span>HotCoffee</span>
            </Link>
            <p>{SITE.tagline} Fresh pastries, handmade desserts and smoothies — every day in the heart of Tashkent.</p>
            <div className="footer-socials">
              {SITE.socials.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                  {socialIcons[social.name]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Menu</Link></li>
              {authMember && <li><Link to="/orders">My orders</Link></li>}
              {authMember && <li><Link to="/member-page">My page</Link></li>}
              <li><Link to="/help">Help &amp; FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4>Visit us</h4>
            <ul className="footer-contact">
              <li><PlaceOutlinedIcon /><a href={SITE.mapLink} target="_blank" rel="noreferrer">{SITE.address}</a></li>
              <li><PhoneOutlinedIcon /><a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><MailOutlineRoundedIcon /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>

          <div>
            <h4>Opening hours</h4>
            <ul className="footer-hours">
              {SITE.hours.map((row) => (
                <li key={row.days}><span>{row.days}</span><span>{row.time}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HotCoffee. All rights reserved.</span>
          <span>Photos: Unsplash</span>
        </div>
      </Container>
    </footer>
  );
}
