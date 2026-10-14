import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Container } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import Pagination from "@mui/material/Pagination";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import PageHero from "../../components/common/PageHero";
import ProductCard from "../../components/common/ProductCard";
import { collectionLabels } from "../../../lib/format";

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

const COLLECTIONS = [
    ProductCollection.COFFEE,
    ProductCollection.SMOOTHIE,
    ProductCollection.DESSERTS,
    ProductCollection.SNACKS,
];

const ORDERS = [
    { key: "createdAt", label: "Newest" },
    { key: "productViews", label: "Popular" },
    { key: "productPrice", label: "Price: low to high" },
];

const PAGE_SIZE = 8;

/** URL'dagi ?collection=COFFEE ni o'qiydi (Home'dagi kategoriya kartalari uchun) */
const collectionFromQuery = (search: string): ProductCollection | undefined => {
    const value = new URLSearchParams(search).get("collection")?.toUpperCase();
    return COLLECTIONS.find((collection) => collection === value);
};

export default function Products(props: ProducteProps) {
    const { onAdd } = props;
    const location = useLocation();
    const { setProducts } = actionDispatch(useDispatch());
    const { products } = useSelector(productsRetriever);
    const [loading, setLoading] = useState<boolean>(true);
    const [productSearch, setProductSearch] = useState<ProductInquiry>({
        page: 1,
        order: "createdAt",
        limit: PAGE_SIZE,
        productCollection: collectionFromQuery(location.search),
        search: "",
    });

    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        const collection = collectionFromQuery(location.search);
        setProductSearch((prev) =>
            prev.productCollection === collection ? prev : { ...prev, productCollection: collection, page: 1 }
        );
    }, [location.search]);

    useEffect(() => {
        setLoading(true);
        const product = new ProductService();
        product
            .getProducts(productSearch)
            .then((data) => setProducts(data))
            .catch((err) => {
                console.log(err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSearch]);

    // EVENT HANDLERS
    const searchCollectionHandler = (collection: ProductCollection | undefined) => {
        setProductSearch((prev) => ({ ...prev, productCollection: collection, page: 1 }));
    };

    const searchOrderHandler = (order: string) => {
        setProductSearch((prev) => ({ ...prev, order, page: 1 }));
    };

    const searchProductHandler = (e?: FormEvent) => {
        e?.preventDefault();
        // qidiruv butun menyu bo'ylab: kategoriya filtri olib tashlanadi
        setProductSearch((prev) => ({ ...prev, search: searchText.trim(), productCollection: undefined, page: 1 }));
    };

    const clearSearchHandler = () => {
        setSearchText("");
        setProductSearch((prev) => ({ ...prev, search: "", page: 1 }));
    };

    const paginationHandler = (e: ChangeEvent<unknown>, value: number) => {
        setProductSearch((prev) => ({ ...prev, page: value }));
        window.scrollTo({ top: 260, behavior: "smooth" });
    };

    // server umumiy sonni qaytarmaydi: to'liq sahifa bo'lsa, keyingisi bor deb hisoblaymiz
    const pageCount = products.length < productSearch.limit ? productSearch.page : productSearch.page + 1;

    return (
        <div className="products">
            <PageHero
                eyebrow="Order ahead"
                title="Our menu"
                subtitle="Hand-crafted coffee, fresh smoothies, desserts and pastries — made to order every day."
            >
                <form className="menu-search" onSubmit={searchProductHandler} role="search">
                    <SearchRoundedIcon className="menu-search-icon" />
                    <input
                        type="text"
                        placeholder="Search latte, cheesecake, croissant…"
                        value={searchText}
                        aria-label="Search the menu"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText && (
                        <button type="button" className="menu-search-clear" aria-label="Clear search" onClick={clearSearchHandler}>
                            <CloseRoundedIcon fontSize="small" />
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </PageHero>

            <Container>
                <div className="menu-toolbar">
                    <div className="chip-row" role="tablist" aria-label="Categories">
                        <button
                            type="button"
                            className={`chip ${!productSearch.productCollection ? "active" : ""}`}
                            onClick={() => searchCollectionHandler(undefined)}
                        >
                            All
                        </button>
                        {COLLECTIONS.map((collection) => (
                            <button
                                key={collection}
                                type="button"
                                className={`chip ${productSearch.productCollection === collection ? "active" : ""}`}
                                onClick={() => searchCollectionHandler(collection)}
                            >
                                {collectionLabels[collection]}
                            </button>
                        ))}
                    </div>

                    <label className="menu-sort">
                        <span>Sort by</span>
                        <select value={productSearch.order} onChange={(e) => searchOrderHandler(e.target.value)}>
                            {ORDERS.map((order) => (
                                <option key={order.key} value={order.key}>{order.label}</option>
                            ))}
                        </select>
                    </label>
                </div>

                {productSearch.search && (
                    <p className="menu-result-note">
                        Results for <strong>“{productSearch.search}”</strong>{" "}
                        <button type="button" onClick={clearSearchHandler}>Clear</button>
                    </p>
                )}

                <div className="product-grid menu-grid">
                    {loading && products.length === 0 ? (
                        Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton menu-skeleton" />)
                    ) : products.length === 0 ? (
                        <div className="empty">
                            <SearchOffRoundedIcon />
                            <h3>Nothing found</h3>
                            <p>
                                {productSearch.search
                                    ? "Try another word or browse all categories."
                                    : "This category is empty right now — check back soon."}
                            </p>
                        </div>
                    ) : (
                        products.map((product: Product) => (
                            <ProductCard key={product._id} product={product} onAdd={onAdd} />
                        ))
                    )}
                </div>

                {pageCount > 1 && (
                    <div className="menu-pagination">
                        <Pagination
                            count={pageCount}
                            page={productSearch.page}
                            onChange={paginationHandler}
                            shape="rounded"
                            color="primary"
                        />
                    </div>
                )}
            </Container>
        </div>
    );
}
