import {Order} from "../../model/entity/order";
import {OrderItem} from "../../model/entity/order/order-item";
import {Invoice} from "../../model/entity/payment/invoice";


export interface IInvoiceRepository {

	createInvoice(order: Order, items?: OrderItem[], weight?: number): Promise<Invoice>;
	getInvoicesByOrder(order: Order): Promise<Invoice[]>;

}