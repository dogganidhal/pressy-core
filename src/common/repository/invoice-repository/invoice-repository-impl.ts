import {BaseRepository} from "../base-repository";
import {IInvoiceRepository} from "./index";
import {Article, Order, OrderType} from "../../model/entity/order";
import {OrderItem} from "../../model/entity/order/order-item";
import {Invoice} from "../../model/entity/payment/invoice";
import {Repository} from "typeorm";


export class InvoiceRepositoryImpl extends BaseRepository implements IInvoiceRepository {

	private _invoiceRepository: Repository<Invoice> = this.connection.getRepository(Invoice);

	public async createInvoice(order: Order, items?: OrderItem[], weight?: number): Promise<Invoice> {

		let invoice = new Invoice();

		if (order.type == OrderType.PRESSING) {
			invoice.amount = items!.reduce((accumulator, item) => accumulator + item.article.laundryPrice * item.quantity, 0);
			invoice.items = items!;
		} else {
			invoice.amount = weight! * Article.WEIGHTED_ARTICLE_PRICE;
		}

		invoice.order = order;

		return await this._invoiceRepository.save(invoice);

	}

	public async getInvoicesByOrderId(orderId: number): Promise<Invoice[]> {
		return this._invoiceRepository.find({order: {id: orderId}});
	}

}