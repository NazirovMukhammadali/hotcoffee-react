import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import Statistics from "./Statistics";
import PopularDishes from "./PopularDishes";
import Categories from "./Categories";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import VisitUs from "./VisitUs";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { CartItem } from "../../../lib/types/search";
import "../../../css/home.css";


/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
    setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
    setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

interface HomePageProps {
    onAdd: (item: CartItem) => void;
    setAuthOpen: (isOpen: boolean) => void;
}

export default function HomePage(props: HomePageProps) {
    const { setPopularDishes, setNewDishes, setTopUsers } = actionDispatch(useDispatch());
    const [menuCount, setMenuCount] = useState<number>(0);

    useEffect(() => {
        // Backend server  data fetch => data
        const product = new ProductService();

        product.getProducts({
            page: 1,
            limit: 4,
            order: "productViews",
            productCollection: ProductCollection.COFFEE,
        }).then(data => {
            setPopularDishes(data);
        }).catch(err => { console.log("error", err) });

        product.getProducts({
            page: 1,
            limit: 4,
            order: "createdAt",
            productCollection: ProductCollection.COFFEE,
        }).then(data => {
            setNewDishes(data)
        }).catch(err => { console.log("error", err) });

        product.getProducts({ page: 1, limit: 100, order: "createdAt" })
            .then((data) => setMenuCount(data.length))
            .catch((err) => console.log(err));

        const member = new MemberService();
        member.getTopUsers().then((data) => {
            setTopUsers(data);
        }).catch((err) => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="homepage">
            <Hero setAuthOpen={props.setAuthOpen} />
            <Statistics menuCount={menuCount} />
            <PopularDishes onAdd={props.onAdd} />
            <Categories />
            <NewDishes onAdd={props.onAdd} />
            <Advertisement />
            <ActiveUsers />
            <Events />
            <VisitUs />
        </div>
    );
}
