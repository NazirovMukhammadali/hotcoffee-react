import React from "react";
import { Container } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { plans } from "../../../lib/data/plans";

export default function Events() {
  return (
    <section className="section events-section">
      <Container>
        <div className="section-head">
          <div>
            <span className="eyebrow">What's on</span>
            <h2 className="section-title">Events at HotCoffee</h2>
            <p className="section-sub">Workshops, tastings and weekly treats — come say hello.</p>
          </div>
        </div>
        <div className="events-grid">
          {plans.map((event) => (
            <article className="event-card" key={event.title}>
              <div className="event-media">
                <img src={event.img} alt="" loading="lazy" />
              </div>
              <div className="event-body">
                <span className="event-host">{event.author}</span>
                <h3>{event.title}</h3>
                <p>{event.desc}</p>
                <div className="event-meta">
                  <span><CalendarMonthOutlinedIcon fontSize="small" /> {event.date}</span>
                  <span><PlaceOutlinedIcon fontSize="small" /> {event.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
