import { useState, SyntheticEvent, useEffect } from "react";
import { Container } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrder } from "./slice";
import { Order, OrderInquery } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { Link, Redirect } from "react-router-dom";
import { imageUrl } from "../../../lib/format";
import PageHero from "../../components/common/PageHero";
import { AppRootState } from "../../../lib/types/screen";
import "../../../css/order.css";


/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
    setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
    setFinishedOrder: (data: Order[]) => dispatch(setFinishedOrder(data)),
});

export default function OrdersPage() {
    const { setPausedOrders, setProcessOrders, setFinishedOrder } =
        actionDispatch(useDispatch());
    const { orderBuilder, authMember } = useGlobals();
    const counts = useSelector((state: AppRootState) => ({
        paused: state.ordersPage.pausedOrders.length,
        process: state.ordersPage.processOrders.length,
        finished: state.ordersPage.finishedOrders.length,
    }));
    const [value, setValue] = useState("1");
    const [orderInquery] = useState<OrderInquery>({
        page: 1,
        limit: 20,
        orderStatus: OrderStatus.PAUSE,
    });

    useEffect(() => {
        if (!authMember) return;
        const order = new OrderService();

        order.getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE })
            .then((data) => setPausedOrders(data))
            .catch((err) => console.log(err));

        order.getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
            .then((data) => setProcessOrders(data))
            .catch((err) => console.log(err));

        order.getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
            .then((data) => setFinishedOrder(data))
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderInquery, orderBuilder]);

    // HANDLERS
    const handleChange = (e: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    if (!authMember) return <Redirect to="/" />;

    const tabLabel = (label: string, count: number) => (
        <span className="tab-label">{label}{count > 0 && <em>{count}</em>}</span>
    );

    return (
        <div className="order-page">
            <PageHero
                eyebrow="Your account"
                title="My orders"
                subtitle="Pay for new orders, follow what is being prepared and look back at past treats."
                image="/img/events/pastry-friday.jpg"
            />
            <Container className="order-container">
                <div className="order-layout">
                    <section className="order-main">
                        <TabContext value={value}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="Order status"
                                className="order-tabs"
                                variant="scrollable"
                                scrollButtons={false}
                            >
                                <Tab label={tabLabel("Awaiting payment", counts.paused)} value={"1"} />
                                <Tab label={tabLabel("Preparing", counts.process)} value={"2"} />
                                <Tab label={tabLabel("Completed", counts.finished)} value={"3"} />
                            </Tabs>
                            <PausedOrders setValue={setValue} />
                            <ProcessOrders setValue={setValue} />
                            <FinishedOrders />
                        </TabContext>
                    </section>

                    <aside className="order-side">
                        <div className="card profile-card">
                            <img
                                src={imageUrl(authMember.memberImage)}
                                className="profile-avatar"
                                alt={authMember.memberNick}
                            />
                            <div className="profile-ident">
                                <strong className="profile-name">{authMember.memberNick}</strong>
                                <span className="profile-meta">
                                    <PlaceOutlinedIcon fontSize="small" />
                                    {authMember.memberAddress || "No address yet"}
                                </span>
                            </div>
                            <div className="profile-points">
                                <EmojiEventsOutlinedIcon />
                                <div>
                                    <strong>{authMember.memberPoint ?? 0}</strong>
                                    <span>loyalty points</span>
                                </div>
                            </div>
                            <Link to="/member-page" className="btn btn-ghost btn-sm">Edit profile</Link>
                        </div>

                        <div className="card how-card">
                            <h3>How ordering works</h3>
                            <ol>
                                <li><b>Place an order</b> from your basket.</li>
                                <li><b>Pay</b> in “Awaiting payment” — you earn 1 point.</li>
                                <li><b>We prepare it</b> and you confirm when it arrives.</li>
                            </ol>
                            <p className="demo-note">
                                <InfoOutlinedIcon fontSize="small" />
                                Demo shop: payments are simulated, no card is charged.
                            </p>
                        </div>
                    </aside>
                </div>
            </Container>
        </div >
    );
}
