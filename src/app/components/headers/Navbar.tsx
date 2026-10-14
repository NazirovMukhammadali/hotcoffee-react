import React, { useEffect, useState } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { Container, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Logout from "@mui/icons-material/Logout";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Basket from "./Basket";
import BrandMark from "../common/BrandMark";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { imageUrl } from "../../../lib/format";

interface NavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setAuthOpen: (isOpen: boolean) => void;
  anchorEl: HTMLElement | null;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function Navbar(props: NavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setAuthOpen,
    anchorEl,
    handleLogoutClick,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();
  const location = useLocation();
  const history = useHistory();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // product sahifasida hero yo'q, shuning uchun navbar doim to'q rangda
  const alwaysSolid = /^\/products\/[^/]+/.test(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: "Home", exact: true, show: true },
    { to: "/products", label: "Menu", exact: false, show: true },
    { to: "/orders", label: "Orders", exact: false, show: !!authMember },
    { to: "/member-page", label: "My page", exact: false, show: !!authMember },
    { to: "/help", label: "Help", exact: false, show: true },
  ].filter((link) => link.show);

  const avatar = imageUrl(authMember?.memberImage);

  return (
    <nav className={`navbar ${scrolled || alwaysSolid ? "solid" : ""}`}>
      <Container className="navbar-inner">
        <NavLink to="/" className="navbar-brand" aria-label="HotCoffee home">
          <BrandMark size={36} />
          <span>HotCoffee</span>
        </NavLink>

        <div className="navbar-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} exact={link.exact} activeClassName="active">
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <Basket
            cartItems={cartItems}
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
            setAuthOpen={setAuthOpen}
          />

          {!authMember ? (
            <button type="button" className="btn btn-primary btn-sm navbar-login" onClick={() => setAuthOpen(true)}>
              Sign in
            </button>
          ) : (
            <button type="button" className="navbar-avatar" aria-haspopup="true" onClick={handleLogoutClick}>
              <img src={avatar} alt={authMember.memberNick} onError={(e) => ((e.target as HTMLImageElement).src = "/icons/default-user.svg")} />
            </button>
          )}

          <IconButton className="navbar-burger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
        </div>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseLogout}
        onClick={handleCloseLogout}
        PaperProps={{ className: "account-menu", elevation: 0 }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="account-menu-head">
          <strong>{authMember?.memberNick}</strong>
          <span>{authMember?.memberPoint ?? 0} loyalty points</span>
        </div>
        <Divider />
        <MenuItem onClick={() => history.push("/member-page")}>
          <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          My page
        </MenuItem>
        <MenuItem onClick={() => history.push("/orders")}>
          <ListItemIcon><ReceiptLongOutlinedIcon fontSize="small" /></ListItemIcon>
          My orders
        </MenuItem>
        <MenuItem onClick={handleLogoutRequest}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ className: "nav-drawer" }}>
        <div className="nav-drawer-head">
          <span className="navbar-brand">
            <BrandMark size={34} />
            <span>HotCoffee</span>
          </span>
          <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </div>

        {authMember && (
          <div className="nav-drawer-user">
            <img src={avatar} alt="" />
            <div>
              <strong>{authMember.memberNick}</strong>
              <span>{authMember.memberPoint ?? 0} loyalty points</span>
            </div>
          </div>
        )}

        <div className="nav-drawer-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} exact={link.exact} activeClassName="active">
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-drawer-foot">
          {!authMember ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setDrawerOpen(false);
                setAuthOpen(true);
              }}
            >
              Sign in
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={handleLogoutRequest}>
              <Logout fontSize="small" /> Sign out
            </button>
          )}
        </div>
      </Drawer>
    </nav>
  );
}
