import React from "react";
import moment from "moment";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { imageUrl, money } from "../../../lib/format";

export interface OrderAction {
  label: string;
  variant: "primary" | "ghost";
  onClick: (order: Order) => void;
}

const statusLabels: Record<string, string> = {
  [OrderStatus.PAUSE]: "Awaiting payment",
  [OrderStatus.PROCESS]: "Preparing",
  [OrderStatus.FINISH]: "Completed",
  [OrderStatus.DELETE]: "Cancelled",
};

export default function OrderCard(props: { order: Order; actions?: OrderAction[] }) {
  const { order, actions = [] } = props;

  return (
    <article className="order-card">
      <header className="order-card-head">
        <div>
          <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
          <span>{moment(order.createdAt).format("D MMM YYYY, HH:mm")}</span>
        </div>
        <span className={`status-pill status-${order.orderStatus.toLowerCase()}`}>
          {statusLabels[order.orderStatus] ?? order.orderStatus}
        </span>
      </header>

      <ul className="order-items">
        {order.orderItems?.map((item: OrderItem) => {
          const product: Product | undefined = order.productData.find((ele: Product) => item.productId === ele._id);
          if (!product) return null;
          return (
            <li key={item._id}>
              <img src={imageUrl(product.productImages[0], "/icons/noimage-list.svg")} alt="" />
              <div className="order-item-name">
                <strong>{product.productName}</strong>
                <span>
                  {item.itemQuantity} × {money(item.itemPrice)}
                </span>
              </div>
              <span className="order-item-total">{money(item.itemQuantity * item.itemPrice)}</span>
            </li>
          );
        })}
      </ul>

      <footer className="order-card-foot">
        <div className="order-totals">
          <span>Items <b>{money(order.orderTotal - order.orderDelivery)}</b></span>
          <span>Delivery <b>{order.orderDelivery ? money(order.orderDelivery) : "Free"}</b></span>
          <span className="grand">Total <b>{money(order.orderTotal)}</b></span>
        </div>
        {actions.length > 0 && (
          <div className="order-actions">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`btn btn-sm ${action.variant === "primary" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => action.onClick(order)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
