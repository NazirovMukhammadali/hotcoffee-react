import React from "react";
import { Container } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Settings } from "./Settings";
import { Link, Redirect } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { imageUrl } from "../../../lib/format";
import PageHero from "../../components/common/PageHero";
import "../../../css/userPage.css";

export default function UserPage() {
  const { authMember } = useGlobals();
  if (!authMember) return <Redirect to="/" />;

  return (
    <div className="user-page">
      <PageHero
        eyebrow="Your account"
        title="My page"
        subtitle="Keep your details up to date so your coffee always finds you."
        image="/img/categories/coffee.jpg"
      />
      <Container className="user-container">
        <div className="user-layout">
          <aside className="card profile-card user-profile">
            <img src={imageUrl(authMember.memberImage)} className="profile-avatar" alt={authMember.memberNick} />
            <div className="profile-ident">
              <strong className="profile-name">{authMember.memberNick}</strong>
              <span className="profile-meta">
                <PlaceOutlinedIcon fontSize="small" />
                {authMember.memberAddress || "No address yet"}
              </span>
              <span className="profile-meta">
                <PhoneOutlinedIcon fontSize="small" />
                {authMember.memberPhone}
              </span>
            </div>
            <div className="profile-points">
              <EmojiEventsOutlinedIcon />
              <div>
                <strong>{authMember.memberPoint ?? 0}</strong>
                <span>loyalty points</span>
              </div>
            </div>
            {authMember.memberDesc && <p className="user-desc">“{authMember.memberDesc}”</p>}
            <Link to="/orders" className="btn btn-dark btn-sm">View my orders</Link>
          </aside>

          <Settings />
        </div>
      </Container>
    </div>
  );
}
