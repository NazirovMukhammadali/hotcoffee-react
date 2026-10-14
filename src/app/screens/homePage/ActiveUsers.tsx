import React from "react";
import { Container } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { Member } from "../../../lib/types/member";
import { imageUrl } from "../../../lib/format";

const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({ topUsers }));

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);
  if (topUsers.length === 0) return null;

  return (
    <section className="section regulars-section">
      <Container>
        <div className="section-head">
          <div>
            <span className="eyebrow">Loyalty club</span>
            <h2 className="section-title">Our regulars</h2>
            <p className="section-sub">Guests with the most loyalty points. Every paid order earns you one.</p>
          </div>
        </div>
        <div className="regulars-grid">
          {topUsers.map((member: Member, index: number) => (
            <div className="regular" key={member._id}>
              <div className="regular-avatar">
                <img src={imageUrl(member.memberImage)} alt={member.memberNick} loading="lazy" />
                <span className="regular-rank">#{index + 1}</span>
              </div>
              <strong>{member.memberNick}</strong>
              <span className="regular-points">
                <EmojiEventsOutlinedIcon fontSize="small" /> {member.memberPoint} points
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
