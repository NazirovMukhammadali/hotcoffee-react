import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
    products,
}));

interface ProducteProps {
    onAdd: (item: CartItem) => void;
}

export default function Products(props: ProducteProps) {
    const { onAdd } = props;
    const { setProducts } = actionDispatch(useDispatch());
    const { products } = useSelector(productsRetriever);
    const [productSearch, setProductSearch] = useState<ProductInquiry>({
        page: 1,
        order: "createdAt",
        limit: 8,
        productCollection: ProductCollection.DISH,
        search: "",
    });

    const [searchText, setSearchText] = useState<string>("");
    const history = useHistory();

    useEffect(() => {
        const product = new ProductService();
        product
            .getProducts(productSearch)
            .then((data) => setProducts(data))
            .catch((err) => console.log(err));
    }, [productSearch]);

    useEffect(() => {
        if (searchText === "") {
            productSearch.search = "";
            setProductSearch({ ...productSearch });
        }
    }, [searchText]);

    // EVENT HANDLERS
    const searchCollectionHandler = (collection: ProductCollection) => {
        productSearch.page = 1;
        productSearch.productCollection = collection;
        setProductSearch({ ...productSearch });
    };

    const searchOrderHandler = (order: string) => {
        productSearch.page = 1;
        productSearch.order = order;
        setProductSearch({ ...productSearch });
    }

    const searchProductHandler = () => {
        productSearch.search = searchText;
        setProductSearch({ ...productSearch });
    };

    const paginationHandler = (e: ChangeEvent<any>, value: number) => {
        productSearch.page = value;
        setProductSearch({ ...productSearch });
    }

    const chooseDishHandler = (id: string) => {
        history.push(`/products/${id}`);
    };

    return (
        <div className={"products"}>
            <Container sx={{ padding: "0E" }}>
                <Stack
                    flexDirection={"column"}
                    sx={{ width: "1300px" }}
                    alignItems={"center"}
                >
                    <Stack className={"avatar-big-box"}>
                        <Stack className="top-content">
                            <Box className="text">Burak Restaurant</Box>
                            <Box className="search-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Type here"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") searchProductHandler();
                                    }}
                                />
                                <button
                                    className="search-button"
                                    onClick={searchProductHandler}
                                >
                                    SEARCH <SearchIcon />
                                </button>
                            </Box>
                        </Stack>
                    </Stack>

                    <Stack className={"dishes-filter-section"}>
                        <Stack className="dishes-filter-box">
                            <Button
                                variant="contained"
                                className="order"
                                color={productSearch.order === "createdAt" ? "primary" : "secondary"}
                                onClick={() => searchOrderHandler("createdAt")}
                            >
                                New
                            </Button>
                            <Button
                                variant="contained"
                                className="order"
                                color={productSearch.order === "productPrice" ? "primary" : "secondary"}
                                onClick={() => searchOrderHandler("productPrice")}
                            >
                                Price
                            </Button>
                            <Button
                                variant="contained"
                                className="order"
                                color={productSearch.order === "productViews" ? "primary" : "secondary"}
                                onClick={() => searchOrderHandler("productViews")}
                            >
                                Views
                            </Button>
                        </Stack>
                    </Stack>

                    <Stack className={"list-category-section"}>
                        <Stack className="product-category">
                            <div className="category-main">
                                <Button
                                    variant="contained"
                                    color={productSearch.productCollection === ProductCollection.OTHER
                                        ? "secondary" : "secondary"}
                                    onClick={() =>
                                        searchCollectionHandler(ProductCollection.OTHER)
                                    }
                                >
                                    Other
                                </Button>
                                <Button
                                    variant="contained"
                                    color={productSearch.productCollection === ProductCollection.DESSERT
                                        ? "secondary" : "secondary"}
                                    onClick={() =>
                                        searchCollectionHandler(ProductCollection.DESSERT)
                                    }
                                >
                                    Desert
                                </Button>
                                <Button
                                    variant="contained"
                                    color={productSearch.productCollection === ProductCollection.DRINK
                                        ? "secondary" : "secondary"}
                                    onClick={() =>
                                        searchCollectionHandler(ProductCollection.DRINK)
                                    }
                                >
                                    Drink
                                </Button>
                                <Button
                                    variant="contained"
                                    color={productSearch.productCollection === ProductCollection.SALAD
                                        ? "secondary" : "secondary"}
                                    onClick={() =>
                                        searchCollectionHandler(ProductCollection.SALAD)
                                    }
                                >
                                    Salad
                                </Button>
                                <Button
                                    variant="contained"
                                    color={productSearch.productCollection === ProductCollection.DISH
                                        ? "secondary" : "secondary"}
                                    onClick={() =>
                                        searchCollectionHandler(ProductCollection.DISH)
                                    }
                                >
                                    Dish
                                </Button>
                            </div>
                        </Stack>
                        <Stack className="product-wrapper">
                            {products.length !== 0 ? (
                                products.map((product: Product) => {
                                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                                    const sizeVolume =
                                        product.productCollection === ProductCollection.DRINK
                                            ? product.productVolume + " litre"
                                            : product.productSize + " size";
                                    return (
                                        <Stack key={product._id} className="product-card"
                                            onClick={() => chooseDishHandler(product._id)}
                                        >
                                            <Stack
                                                className="product-img"
                                                sx={{ backgroundImage: `url(${imagePath})` }}
                                            >
                                                <div className="product-sale">{sizeVolume}</div>
                                                <Button
                                                    className="shop-btn"
                                                    onClick={(e) => {
                                                        onAdd({
                                                            _id: product._id,
                                                            quantity: 1,
                                                            name: product.productName,
                                                            price: product.productPrice,
                                                            image: product.productImages[0],
                                                        });
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <img
                                                        src="/icons/shopping-cart.svg"
                                                        style={{ display: "flex" }}
                                                    />
                                                </Button>
                                                <Button className="view-btn" sx={{ right: "36px" }}>
                                                    <Badge badgeContent={20} color="secondary">
                                                        <RemoveRedEyeIcon
                                                            sx={{ color: true ? "gray" : "white" }}
                                                        />
                                                    </Badge>
                                                </Button>
                                            </Stack>
                                            <Box className="product-desc-box">
                                                <span className="product-title">
                                                    {product.productName}
                                                </span>
                                                <div className="product-desc">
                                                    <MonetizationOnIcon />
                                                    {12}
                                                </div>
                                            </Box>
                                        </Stack>
                                    );
                                })
                            ) : (
                                <Box className="no-data">Products are not available</Box>
                            )}
                        </Stack>
                    </Stack>

                    <Stack className={"pagination-section"}>
                        <Pagination
                            count={
                                products.length !== 0
                                    ? productSearch.page + 1
                                    : productSearch.page}
                            page={productSearch.page}
                            renderItem={(item) => (
                                <PaginationItem
                                    components={{
                                        previous: ArrowBackIcon,
                                        next: ArrowForwardIcon,
                                    }}
                                    {...item}
                                    color="secondary"
                                />
                            )}
                        />
                    </Stack>
                </Stack>
            </Container>

            <div className={"brand-logo"}>
                <Container className="family-brands">
                    <Box className="category-title">Our Coffee Selection</Box>
                    <Stack className="brand-list">
                        <Box className="review-box">
                            <img src="/img/espresso-coffe.png" />
                        </Box>
                        <Box className="review-box">
                            <img src="/img/cappuccino-coffee.png" />
                        </Box>
                        <Box className="review-box">
                            <img src="/img/latte-coffee.png" />
                        </Box>
                        <Box className="review-box">
                            <img src="/img/mocha-coffee.png" />
                        </Box>
                    </Stack>
                </Container>
            </div>

            <div className={"address"}>
                <Container>
                    <Stack className="address-are" sx={{ width: "1300px" }}>
                        <Box className="title">Our address</Box>
                        <iframe
                            style={{ marginTop: "60px" }}
                            src="https://www.google.com/maps?q=41.7545047,60.1636175&z=17&output=embed"
                            width={"1300"}
                            height={"600"}
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </Stack>
                </Container>
            </div>
        </div>
    );
}