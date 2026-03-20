import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import React, { useEffect, useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
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

export default function HomeNavbar(props: HomeNavbarProps) {
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

    /* HANDLERS */


    return (
        <div className="home-navbar hero-with-overlay" style={{ backgroundImage: `url(${process.env.PUBLIC_URL || ''}/img/main_background.jpg)` }}>
            <div className="hero-overlay" aria-hidden="true" />
            <div className="navbar-menu-bar">
                <Stack className="menu">
                    <NavLink to="/" className="navbar-logo-link navbar-brand">
                        HotCoffee
                    </NavLink>
                    <Box className="menu-spacer" />
                    <Stack className="links-center">
                        <Box className={"hover-line"}>
                            <NavLink to="/" activeClassName={"underLine"}>
                                Home
                            </NavLink>
                        </Box>
                        <Box className={"hover-line"}>
                            <NavLink to="/products" activeClassName={"underLine"}>
                                Products
                            </NavLink>
                        </Box>
                        {authMember && (
                            <Box className={"hover-line"}>
                                <NavLink to="/orders" activeClassName={"underLine"}>
                                    Orders
                                </NavLink>
                            </Box>
                        )}
                        {authMember && (
                            <Box className={"hover-line"}>
                                <NavLink to="/member-page" activeClassName={"underLine"}>
                                    My Page
                                </NavLink>
                            </Box>
                        )}
                        <Box className={"hover-line"}>
                            <NavLink to="/help" activeClassName={"underLine"}>
                                Help
                            </NavLink>
                        </Box>
                    </Stack>
                    <Stack className="links-right">
                        <Basket
                            cartItems={cartItems}
                            onAdd={onAdd}
                            onRemove={onRemove}
                            onDelete={onDelete}
                            onDeleteAll={onDeleteAll}
                        />

                        {!authMember ? (
                            <Box>
                                <Button variant="outlined"
                                    className="login-button"
                                    onClick={() => setAuthOpen(true)}
                                >
                                    Login
                                </Button>
                            </Box>
                        ) : (
                            <img
                                className="user-avatar"
                                src={authMember?.memberImage
                                    ? `${serverApi}/${authMember?.memberImage}`
                                    : "/icons/default-user.svg"
                                }
                                aria-haspopup={"true"}
                                onClick={handleLogoutClick}
                            />
                        )}

                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={Boolean(anchorEl)}
                            onClose={handleCloseLogout}
                            onClick={handleCloseLogout}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleLogoutRequest}>
                                <ListItemIcon>
                                    <Logout fontSize="small" style={{ color: 'blue' }} />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                        <Box className="logo-placeholder" />
                    </Stack>
                </Stack>
            </div>
            <Container className="navbar-container">
                <Stack className={"header-frame"}>
                    <Stack className={"detail"}>
                        <Box className={"hero-tagline"}>
                            <span className={"hero-tagline-intro"}>Fresh and Tasty</span>
                            <span className={"hero-tagline-coffee"}>coffee</span>
                            <span className={"hero-tagline-outro"}>in the morning</span>
                        </Box>
                    </Stack>
                    <Box className={"logo-frame"}>
                        <div className="logo-img"></div>
                    </Box>
                </Stack>
            </Container>
        </div >
    );
}