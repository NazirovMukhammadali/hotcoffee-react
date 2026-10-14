import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages } from "../../../lib/config";
import { Order, OrderUpdateInput } from "../../../lib/types/order";
import { sweetConfirm, sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";
import { money } from "../../../lib/format";

// REDUX SLICE & SELECTOR
const pausedOrdersRetriever = createSelector(retrievePausedOrders, (pausedOrders) => ({ pausedOrders }));

interface PausedOrdersProps {
    setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
    const { setValue } = props;
    const { authMember, setOrderBuilder } = useGlobals();
    const { pausedOrders } = useSelector(pausedOrdersRetriever);

    // HANDLERS
    const deleteOrderHandler = async (order: Order) => {
        try {
            if (!authMember) throw new Error(Messages.error2);

            const confirmed = await sweetConfirm("Cancel this order?", "The items will go back on the menu.", "Cancel order", "Keep it");
            if (!confirmed) return;

            const input: OrderUpdateInput = { orderId: order._id, orderStatus: OrderStatus.DELETE };
            await new OrderService().updateOrder(input);
            setOrderBuilder(new Date());
            sweetTopSmallSuccessAlert("Order cancelled", 1500);
        } catch (err) {
            console.log(err);
            sweetErrorHandling(err).then();
        }
    };

    const processOrderHandler = async (order: Order) => {
        try {
            if (!authMember) throw new Error(Messages.error2);
            // PAYMENT PROCESS (demo)
            const confirmed = await sweetConfirm(
                `Pay ${money(order.orderTotal)}?`,
                "This is a demo shop — no real payment is taken.",
                "Pay now"
            );
            if (!confirmed) return;

            const input: OrderUpdateInput = { orderId: order._id, orderStatus: OrderStatus.PROCESS };
            await new OrderService().updateOrder(input);

            setValue("2");
            setOrderBuilder(new Date());
            sweetTopSmallSuccessAlert("Paid! Your order is being prepared. +1 point", 2200);
        } catch (error) {
            console.log(error);
            sweetErrorHandling(error).then();
        }
    };

    return (
        <TabPanel value={"1"} className="orders-panel">
            {pausedOrders?.length ? (
                pausedOrders.map((order: Order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        actions={[
                            { label: "Cancel", variant: "ghost", onClick: deleteOrderHandler },
                            { label: `Pay ${money(order.orderTotal)}`, variant: "primary", onClick: processOrderHandler },
                        ]}
                    />
                ))
            ) : (
                <EmptyOrders title="No orders awaiting payment" text="Add something tasty to your basket and place an order." />
            )}
        </TabPanel>
    );
}
