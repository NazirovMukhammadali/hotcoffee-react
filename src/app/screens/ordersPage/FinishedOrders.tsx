import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Order } from "../../../lib/types/order";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

// REDUX SLICE & SELECTOR
const finishedOrdersRetriever = createSelector(retrieveFinishedOrders, (finishedOrders) => ({ finishedOrders }));

export default function FinishedOrders() {
    const { finishedOrders } = useSelector(finishedOrdersRetriever);
    return (
        <TabPanel value={"3"} className="orders-panel">
            {finishedOrders?.length ? (
                finishedOrders.map((order: Order) => <OrderCard key={order._id} order={order} />)
            ) : (
                <EmptyOrders title="No completed orders yet" text="Your order history will show up here." />
            )}
        </TabPanel>
    );
}
