import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages } from "../../../lib/config";
import { Order, OrderUpdateInput } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetConfirm, sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

// REDUX SLICE & SELECTOR
const processOrdersRetriever = createSelector(retrieveProcessOrders, (processOrders) => ({ processOrders }));

interface ProcessOrdersProps {
    setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
    const { setValue } = props;
    const { authMember, setOrderBuilder } = useGlobals();
    const { processOrders } = useSelector(processOrdersRetriever);

    //HANDLERS
    const finishOrderHandler = async (order: Order) => {
        try {
            if (!authMember) throw new Error(Messages.error2);

            const confirmed = await sweetConfirm("Got your order?", "Confirm that you have received it.", "Yes, received");
            if (!confirmed) return;

            const input: OrderUpdateInput = { orderId: order._id, orderStatus: OrderStatus.FINISH };
            await new OrderService().updateOrder(input);

            setValue("3");
            setOrderBuilder(new Date());
            sweetTopSmallSuccessAlert("Enjoy your coffee!", 1500);
        } catch (err) {
            console.log(err);
            sweetErrorHandling(err).then();
        }
    };

    return (
        <TabPanel value={"2"} className="orders-panel">
            {processOrders?.length ? (
                processOrders.map((order: Order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        actions={[{ label: "I received it", variant: "primary", onClick: finishOrderHandler }]}
                    />
                ))
            ) : (
                <EmptyOrders title="Nothing is being prepared" text="Paid orders appear here while our baristas work on them." />
            )}
        </TabPanel>
    );
}
