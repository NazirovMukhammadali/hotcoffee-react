import React from "react";
import { Link } from "react-router-dom";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

export default function EmptyOrders(props: { title: string; text: string }) {
  return (
    <div className="empty">
      <ReceiptLongOutlinedIcon />
      <h3>{props.title}</h3>
      <p>{props.text}</p>
      <p style={{ marginTop: 20 }}>
        <Link to="/products" className="btn btn-primary">Browse the menu</Link>
      </p>
    </div>
  );
}
