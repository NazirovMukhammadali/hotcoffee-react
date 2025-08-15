import { Box, Button, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import React, { useEffect, useState } from "react";

export default function HomeNavbar() {
    const authMember = null;
    const [count, setCount] = useState(0);
    const [value, setvalue] = useState<boolean>(true);

    useEffect(() => {
        console.log("componentDidMount", count); // DATA FETCH
        setCount(count + 1);

        return () => {
            console.log("componentWillUnmount");

        };
    }, [value]);

    /* HANDLERS */
    const buttonHandler = () => {
        setvalue(!value);
    }

    return (
        <div className="home-navbar">
            <Container className="navbar-container">
                <Stack className="menu">
                    <Box>
                        <NavLink to="/">
                            <img className="brand-logo" src="/icons/burak.svg" />
                        </NavLink>
                    </Box>
                    <Stack
                        className="links"
                    >
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
                        {authMember ? (
                            <Box className={"hover-line"}>
                                <NavLink to="/orders" activeClassName={"underLine"}>
                                    Orders
                                </NavLink>
                            </Box>
                        ) : null};
                        {authMember ? (
                            <Box className={"hover-line"}>
                                <NavLink to="/member-page" activeClassName={"underLine"}>
                                    My Pages
                                </NavLink>
                            </Box>
                        ) : null};
                        <Box className={"hover-line"}>
                            <NavLink to="/help" activeClassName={"underLine"}>
                                Help
                            </NavLink>
                        </Box>
                        {/* Basket */}
                        <Basket />

                        {!authMember ? (
                            <Box>
                                <Button variant="contained"
                                    className="login-button">
                                    Login
                                </Button>
                            </Box>
                        ) : (
                            <img
                                className="user-avatar"
                                src={"/icons/default-user.svg"}
                                aria-haspopup={"true"}
                            />
                        )};
                    </Stack>
                </Stack>

                <Stack className={"header-frame"}>
                    <Stack className={"detail"}>
                        <Box className={"head-main-txt"}>
                            World's Most Delicious Cousine
                        </Box>
                        <Box className={"wel-txt"}>
                            The Choise, not just a choice
                        </Box>
                        <Box className={"service-txt"}>
                            {count} hours service
                        </Box>
                        <Box className={"signup"}>
                            {!authMember ? (
                                <Button
                                    variant={"contained"}
                                    className={"signup-button"}
                                    onClick={buttonHandler}
                                >
                                    SIGN UP
                                </Button>
                            ) : null}
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