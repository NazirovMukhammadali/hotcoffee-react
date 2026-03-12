import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

export default function Statistics() {
    return (
        <div className="static-frame-wrapper">
            <Box className="static-frame-welcome">Welcome to our coffee house</Box>
            <Box className="static-frame-welcome_title">From a cultural standpoint, coffeehouses 
                largely serve as centers of social interaction: the coffeehouse provides patrons with</Box>
                <Box className="static-frame-welcome_title">a place to congregate, talk, read, write, entertain one another, or pass the time,</Box>
                <Box className="static-frame-welcome_title">whether individually or in small groups.</Box>
            <div className="static-frame">
            <Container>
                <Stack className="info">
                    <Stack className="static-box">
                        <Box className="static-num">12</Box>
                        <Box className="static-text">Restaurants</Box>
                    </Stack>
                    <Divider height="64" width="2" bg="#E3C08D" />
                    <Stack className="static-box">
                        <Box className="static-num">8</Box>
                        <Box className="static-text">Experience</Box>
                    </Stack>
                    <Divider height="64" width="2" bg="#E3C08D" />
                    <Stack className="static-box">
                        <Box className="static-num">50+</Box>
                        <Box className="static-text">Menu</Box>
                    </Stack>
                    <Divider height="64" width="2" bg="#E3C08D" />
                    <Stack className="static-box">
                        <Box className="static-num">200+</Box>
                        <Box className="static-text">Clients</Box>
                    </Stack>

                </Stack>
            </Container>
        </div>
        </div>
    );
}