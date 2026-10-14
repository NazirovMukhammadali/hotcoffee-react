import React, { FormEvent, useState } from "react";
import { Container, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import { SITE } from "../../../lib/data/site";
import { useGlobals } from "../../hooks/useGlobals";
import PageHero from "../../components/common/PageHero";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";

export default function HelpPage() {
  const { authMember } = useGlobals();
  const [value, setValue] = React.useState("1");
  const [name, setName] = useState<string>(authMember?.memberNick ?? "");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  /** HANDLERS **/
  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // xabar foydalanuvchining pochta ilovasida tayyor holda ochiladi
  const contactHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      sweetErrorHandling(Messages.error3).then();
      return;
    }
    const subject = encodeURIComponent(`Message from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()}${email ? ` (${email.trim()})` : ""}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="help-page">
      <PageHero
        eyebrow="Support"
        title="Help & FAQ"
        subtitle="Answers to common questions, our house rules and how to reach the team."
        image="/img/events/meet-baristas.jpg"
      />
      <Container className="help-container">
        <TabContext value={value}>
          <Tabs value={value} onChange={handleChange} aria-label="Help sections" className="help-tabs" variant="scrollable" scrollButtons={false}>
            <Tab label="FAQ" value={"1"} />
            <Tab label="House rules" value={"2"} />
            <Tab label="Contact" value={"3"} />
          </Tabs>

          <TabPanel value={"1"} className="help-panel">
            <div className="faq-list">
              {faq.map((item, index) => (
                <Accordion key={index} disableGutters elevation={0} className="faq-item">
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`faq-${index}`} id={`faq-${index}-header`}>
                    {item.question}
                  </AccordionSummary>
                  <AccordionDetails>{item.answer}</AccordionDetails>
                </Accordion>
              ))}
            </div>
          </TabPanel>

          <TabPanel value={"2"} className="help-panel">
            <ol className="rules-list">
              {terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>
          </TabPanel>

          <TabPanel value={"3"} className="help-panel">
            <div className="contact-layout">
              <form className="card contact-form" onSubmit={contactHandler}>
                <h2>Send us a message</h2>
                <p>Questions about an order, feedback or catering — we usually reply within a day.</p>
                <div className="contact-grid">
                  <div className="field">
                    <label htmlFor="contact-name">Your name</label>
                    <input id="contact-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-email">Email (optional)</label>
                    <input id="contact-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
                </div>
                <button type="submit" className="btn btn-primary">Send message</button>
              </form>

              <aside className="card contact-info">
                <h3>HotCoffee</h3>
                <ul>
                  <li><PlaceOutlinedIcon /><a href={SITE.mapLink} target="_blank" rel="noreferrer">{SITE.address}</a></li>
                  <li><PhoneOutlinedIcon /><a href={SITE.phoneHref}>{SITE.phone}</a></li>
                  <li><MailOutlineRoundedIcon /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
                  <li>
                    <ScheduleOutlinedIcon />
                    <span>{SITE.hours.map((row) => <span key={row.days} className="block">{row.days}: {row.time}</span>)}</span>
                  </li>
                </ul>
              </aside>
            </div>
          </TabPanel>
        </TabContext>
      </Container>
    </div>
  );
}
