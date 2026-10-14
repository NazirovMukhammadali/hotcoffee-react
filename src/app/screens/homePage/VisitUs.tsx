import React from "react";
import { Container } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { SITE } from "../../../lib/data/site";

export default function VisitUs() {
  return (
    <section className="section visit-section">
      <Container>
        <div className="visit-card">
          <div className="visit-info">
            <span className="eyebrow">Visit us</span>
            <h2 className="section-title">Come by for a cup</h2>
            <p className="section-sub">Grab a table by the window or take your order to go.</p>
            <ul>
              <li><PlaceOutlinedIcon /><div><strong>Address</strong><a href={SITE.mapLink} target="_blank" rel="noreferrer">{SITE.address}</a></div></li>
              <li><PhoneOutlinedIcon /><div><strong>Phone</strong><a href={SITE.phoneHref}>{SITE.phone}</a></div></li>
              <li>
                <ScheduleOutlinedIcon />
                <div>
                  <strong>Opening hours</strong>
                  {SITE.hours.map((row) => (
                    <span key={row.days}>{row.days}: {row.time}</span>
                  ))}
                </div>
              </li>
            </ul>
            <a href={SITE.mapLink} target="_blank" rel="noreferrer" className="btn btn-primary">Get directions</a>
          </div>
          <iframe
            className="visit-map"
            title="HotCoffee location on the map"
            src={SITE.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
