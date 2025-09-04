import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../../lib/types/search";
import { Order, OrderInquery, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";

class OrderService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async createOrder(input: CartItem[]): Promise<Order> {
        try {
            const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => {
                return {
                    itemQuantity: cartItem.quantity,
                    itemPrice: cartItem.price,
                    productId: cartItem._id,
                };
            });

            const url = `${this.path}/order/create`;
            const result = await axios.post(url, orderItems, {
                withCredentials: true,
            });
            return result.data;
        } catch (err) {
            console.log("Error. createOrder:", err);
            throw err;
        }
    }

    public async getMyOrders(input: OrderInquery): Promise<Order[]> {
        try {
            const url = `${this.path}/order/all?page=${input.page}&limit=${input.limit}&orderStatus=${input.orderStatus}`;

            const result = await axios.get(url, { withCredentials: true });
            console.log("getMyOrders: ", result.data);
            return result.data;
        } catch (error) {
            console.log("Error in getMyOrders", error);
            throw error;
        }
    }

    public async updateOrder(input: OrderUpdateInput): Promise<Order> {
        try {
            const url = `${this.path}/order/update`;
            const result = await axios.post(url, input, { withCredentials: true });
            console.log("updateOrder: ", result);
            return result.data;
        } catch (err) {
            console.log("Error in updateOrder", err);
            throw err;
        }
    }
    //
}

export default OrderService;