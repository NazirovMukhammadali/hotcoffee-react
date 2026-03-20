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
        limit: 6,
        productCollection: undefined, // All
        search: "",
    });

    const [searchText, setSearchText] = useState<string>("");
    const history = useHistory();

    useEffect(() => {
        const product = new ProductService();
        product
            .getProducts(productSearch)
            .then((data) => setProducts(data))
            .catch((err) => {
                console.log(err);
                setProducts([]);
            });
    }, [productSearch]);

    useEffect(() => {
        if (searchText === "") {
            setProductSearch((prev) => ({ ...prev, search: "" }));
        }
    }, [searchText]);

    // EVENT HANDLERS
    const searchCollectionHandler = (collection: ProductCollection | undefined) => {
        setProductSearch((prev) => ({ ...prev, productCollection: collection, page: 1 }));
    };

    const searchOrderHandler = (order: string) => {
        setProductSearch((prev) => ({ ...prev, order, page: 1 }));
    };

    const searchProductHandler = () => {
        setProductSearch((prev) => ({ ...prev, search: searchText, page: 1 }));
    };

    const paginationHandler = (e: ChangeEvent<any>, value: number) => {
        setProductSearch((prev) => ({ ...prev, page: value }));
    };

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
                            <Box className="text">HotCoffee</Box>
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
                                    <span className="search-btn-text">SEARCH</span>
                                    <SearchIcon className="search-btn-icon" />
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
                                    className={!productSearch.productCollection ? "category-btn active" : "category-btn"}
                                    onClick={() => searchCollectionHandler(undefined)}
                                >
                                    All
                                </Button>
                                <Button
                                    variant="contained"
                                    className={productSearch.productCollection === ProductCollection.COFFEE ? "category-btn active" : "category-btn"}
                                    onClick={() => searchCollectionHandler(ProductCollection.COFFEE)}
                                >
                                    Coffee
                                </Button>
                                <Button
                                    variant="contained"
                                    className={productSearch.productCollection === ProductCollection.SMOOTHIE ? "category-btn active" : "category-btn"}
                                    onClick={() => searchCollectionHandler(ProductCollection.SMOOTHIE)}
                                >
                                    Smoothie
                                </Button>
                                <Button
                                    variant="contained"
                                    className={productSearch.productCollection === ProductCollection.DESSERTS ? "category-btn active" : "category-btn"}
                                    onClick={() => searchCollectionHandler(ProductCollection.DESSERTS)}
                                >
                                    Desserts
                                </Button>
                                <Button
                                    variant="contained"
                                    className={productSearch.productCollection === ProductCollection.SNACKS ? "category-btn active" : "category-btn"}
                                    onClick={() => searchCollectionHandler(ProductCollection.SNACKS)}
                                >
                                    Snacks
                                </Button>
                            </div>
                        </Stack>
                        <Stack className="product-wrapper">
                            {(() => {
                                const filtered = productSearch.productCollection
                                    ? products.filter((p: Product) => p.productCollection === productSearch.productCollection)
                                    : products;
                                if (filtered.length === 0) {
                                    return (
                                        <Box className="no-data">
                                            {productSearch.search ? "Mahsulot topilmadi" : "Products are not available"}
                                        </Box>
                                    );
                                }
                                return filtered.map((product: Product) => {
                                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                                    const sizeVolume =
                                        product.productCollection === ProductCollection.SMOOTHIE
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
                                                    <Badge badgeContent={product.productViews} color="secondary">
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
                                                    ${product.productPrice}
                                                </div>
                                            </Box>
                                        </Stack>
                                    );
                                });
                            })()}
                        </Stack>
                    </Stack>

                    <Stack className={"pagination-section"}>
                        <Pagination
                            count={
                                products.length === 0
                                    ? 1
                                    : products.length < productSearch.limit
                                        ? productSearch.page
                                        : productSearch.page + 1
                            }
                            page={productSearch.page}
                            onChange={paginationHandler}
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