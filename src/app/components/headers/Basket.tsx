import React, { useState } from "react";
import { Badge, Drawer, IconButton } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { imageUrl, money } from "../../../lib/format";
import { SITE } from "../../../lib/data/site";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setAuthOpen: (isOpen: boolean) => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll, setAuthOpen } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // backend bilan bir xil qoida: $100 dan kam bo'lsa yetkazib berish $5
  const itemsPrice: number = cartItems.reduce((a: number, c: CartItem) => a + c.quantity * c.price, 0);
  const shippingCost: number = itemsPrice < SITE.freeDeliveryFrom ? SITE.deliveryFee : 0;
  const totalPrice = itemsPrice + shippingCost;
  const itemsCount = cartItems.reduce((a: number, c: CartItem) => a + c.quantity, 0);
  const freeDeliveryLeft = Math.max(0, SITE.freeDeliveryFrom - itemsPrice);

  const proceedOrderHandler = async () => {
    if (!authMember) {
      setOpen(false);
      setAuthOpen(true);
      return;
    }
    try {
      setSubmitting(true);
      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();
      setOpen(false);
      setOrderBuilder(new Date());
      history.push("/orders");
      sweetTopSmallSuccessAlert("Order placed! Complete the payment to start brewing.", 2500);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <IconButton className="navbar-icon" aria-label={`Basket, ${itemsCount} items`} onClick={() => setOpen(true)}>
        <Badge badgeContent={itemsCount} color="primary" max={99}>
          <ShoppingBagOutlinedIcon />
        </Badge>
      </IconButton>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ className: "basket-drawer" }}>
        <header className="basket-head">
          <div>
            <h2>Your basket</h2>
            <span>{itemsCount === 0 ? "No items yet" : `${itemsCount} item${itemsCount === 1 ? "" : "s"}`}</span>
          </div>
          <IconButton aria-label="Close basket" onClick={() => setOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </header>

        {cartItems.length === 0 ? (
          <div className="basket-empty">
            <ShoppingBagOutlinedIcon />
            <h3>Your basket is empty</h3>
            <p>Pick your favourite coffee or a fresh pastry to get started.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setOpen(false);
                history.push("/products");
              }}
            >
              Browse the menu
            </button>
          </div>
        ) : (
          <>
            <div className="basket-list">
              {cartItems.map((item: CartItem) => (
                <div className="basket-item" key={item._id}>
                  <img src={imageUrl(item.image, "/icons/noimage-list.svg")} alt="" />
                  <div className="basket-item-info">
                    <strong>{item.name}</strong>
                    <span>{money(item.price)}</span>
                    <div className="qty">
                      <button type="button" aria-label="Decrease" onClick={() => onRemove(item)}>
                        <RemoveRoundedIcon />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label="Increase" onClick={() => onAdd({ ...item, quantity: 1 })}>
                        <AddRoundedIcon />
                      </button>
                    </div>
                  </div>
                  <div className="basket-item-side">
                    <strong>{money(item.price * item.quantity)}</strong>
                    <IconButton size="small" aria-label={`Remove ${item.name}`} onClick={() => onDelete(item)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              ))}
              <button type="button" className="basket-clear" onClick={onDeleteAll}>
                Clear basket
              </button>
            </div>

            <footer className="basket-summary">
              <div className="delivery-progress">
                {freeDeliveryLeft > 0 ? (
                  <span>
                    Add <strong>{money(freeDeliveryLeft)}</strong> more for free delivery
                  </span>
                ) : (
                  <span><strong>Free delivery</strong> unlocked</span>
                )}
                <div className="bar">
                  <div style={{ width: `${Math.min(100, (itemsPrice / SITE.freeDeliveryFrom) * 100)}%` }} />
                </div>
              </div>
              <div className="row"><span>Subtotal</span><span>{money(itemsPrice)}</span></div>
              <div className="row"><span>Delivery</span><span>{shippingCost ? money(shippingCost) : "Free"}</span></div>
              <div className="row total"><span>Total</span><span>{money(totalPrice)}</span></div>
              <button type="button" className="btn btn-primary basket-cta" disabled={submitting} onClick={proceedOrderHandler}>
                {authMember ? (submitting ? "Placing order…" : "Place order") : "Sign in to order"}
              </button>
              <p className="basket-note">Final price is confirmed by the shop when the order is placed.</p>
            </footer>
          </>
        )}
      </Drawer>
    </>
  );
}
