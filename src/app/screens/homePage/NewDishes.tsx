import React from "react";
import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import { CssVarsProvider } from "@mui/joy/styles";
import CardOverflow from "@mui/joy/CardOverflow";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "../../components/divider";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { retrieveNewDishes } from "./selector";
import { serverApi } from "../../../lib/config";

const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
    newDishes,
}));

export default function NewDishes() {
    const { newDishes } = useSelector(newDishesRetriever);
    return (
        <div className={"new-products-frame"}>
            <Container>
                <Stack className={"main"}>
                    <Box className={"category-title"}>New Menu</Box>
                    <Stack className={"cards-frame"}>
                        <CssVarsProvider>
                            {newDishes.length !== 0 ? (
                                newDishes.map((product: Product) => {
                                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                                    return (
                                        <Card
                                            key={product._id}
                                            variant="outlined"
                                            className={"card"}
                                        >
                                            <CardOverflow>
                                                <AspectRatio ratio="1">
                                                    <img src={imagePath} alt="" />
                                                </AspectRatio>
                                            </CardOverflow>

                                            <CardOverflow variant="soft" className="product-detail">
                                                <Stack className="info">
                                                    <Stack flexDirection="row" alignItems="center">
                                                        <Typography className="title">
                                                            {product.productName}
                                                        </Typography>
                                                        <Divider width="2" height="24" bg="#d9d9d9" />
                                                        <Typography className="price">
                                                            ${product.productPrice}
                                                        </Typography>
                                                    </Stack>

                                                    <Stack flexDirection="row" alignItems="center">
                                                        <Typography className="views">
                                                            {product.productViews}
                                                            <VisibilityIcon
                                                                sx={{ fontSize: 20, marginLeft: "5px" }}
                                                            />
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </CardOverflow>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Box className="no-data">New products are not aviable</Box>
                            )}
                        </CssVarsProvider>
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}
