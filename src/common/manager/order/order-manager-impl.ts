import { IOrderManager } from ".";
import { CreateOrderRequestDto } from "../../model/dto";
import { Order, OrderType } from "../../model/entity/order";
import { Member } from "../../model/entity/users/member";
import { exception } from "../../errors";
import { RepositoryFactory } from "../../repository/factory";
import { ISlotRepository, IOrderRepository } from "../../repository";
import { OrderItem } from "../../model/entity/order/order-item";
import { IInvoiceRepository } from "../../repository/invoice-repository";
import { TerminateOrderRequest } from "../../model/dto/order/terminate-order-request";
import { IArticleRepository } from "../../repository/article-repository";
import { Invoice } from "../../model/entity/payment/invoice";
import { getConfig } from "../../../config";
import Stripe from "stripe";
import { IPaymentAccountRepository } from "../../repository/payment-account-repository";
import { getStripeInstance } from "../../../utils/stripe";


export class OrderManagerImpl implements IOrderManager {

  private _articleRepository: IArticleRepository = RepositoryFactory.instance.articleRepository;
  private _slotRepository: ISlotRepository = RepositoryFactory.instance.slotRepository;
  private _orderRepository: IOrderRepository = RepositoryFactory.instance.orderRepository;
  private _invoiceRepository: IInvoiceRepository = RepositoryFactory.instance.invoiceRepository;
  private _paymentAccountRepository: IPaymentAccountRepository = RepositoryFactory.instance.paymentAccountRepository;

  public async order(member: Member, request: CreateOrderRequestDto): Promise<Order> {

    // TODO: Do the check later
    // if (!member.isActive())
    //   throw new exception.InactiveMemberException(member);

    let pickupSlot = await this._slotRepository.getSlotById(request.pickupSlotId);

    if (!pickupSlot)
      throw new exception.SlotNotFoundException(request.pickupSlotId);

    let deliverySlot = await this._slotRepository.getSlotById(request.deliverySlotId);

    if (!deliverySlot)
      throw new exception.SlotNotFoundException(request.deliverySlotId);

    let addressRepository = RepositoryFactory.instance.addressRepository;
    let addressEntity = await addressRepository.getAddressById(request.addressId);

    if (!addressEntity)
      throw new exception.AddressNotFoundException(request.addressId);

    let paymentAccount = await this._paymentAccountRepository.getPaymentAccountById(request.paymentAccountId);
    if (!paymentAccount || paymentAccount.member.id != member.id)
      throw new exception.PaymentAccountNotFoundException(request.paymentAccountId);

      
    let order = Order.create({
      member, pickupSlot, deliverySlot,
      address: await addressRepository.duplicateAddress(addressEntity),
      type: request.type, paymentAccount
    });

    return await this._orderRepository.createOrder(order);

  }

  public async terminateOrder(request: TerminateOrderRequest): Promise<Invoice> {

    let order = await this._orderRepository.getOrderById(request.orderId);

    if (!order)
      throw new exception.OrderNotFoundException(request.orderId);

    let invoices = await this._invoiceRepository.getInvoicesByOrderId(order.id);
    if (invoices.length > 0)
      throw new exception.OrderAlreadyInvoiced(request.orderId);

    let items: OrderItem[] | undefined = undefined;
    let weight: number | undefined = undefined;

    if (order.type == OrderType.PRESSING && !request.orderItems)
      throw new exception.EmptyOrderException;
    else
      items = await Promise.all(request.orderItems.map(async item => {
        let orderItem = new OrderItem();
        let article = await this._articleRepository.getArticleById(item.articleId);
        if (!article)
          throw new exception.ArticleNotFound(item.articleId);
        orderItem.article = article;
        orderItem.quantity = item.quantity;
        orderItem.comment = item.comment;
        return orderItem;
      }));

    if (order.type == OrderType.WEIGHT && !request.weight)
      throw new exception.EmptyOrderException;
    else
      weight = request.weight;

    let stripeOrder = await this.createStripeOrder(order.member.fullName, order.address.formattedAddress, items, weight);
    order.stripeOrderId = stripeOrder!.id;
    this._orderRepository.saveOrder(order);

    return await this._invoiceRepository.createInvoice(order, items, weight);

  }

  public async applyAbsencePenalty(orderId: number): Promise<void> {
    let stripe = getStripeInstance();
    let penaltyArticle = await this._articleRepository.getPenaltyArticle();
    if (penaltyArticle) {
      let stripeOrder = await stripe.orders.create({
        currency: "eur",
        items: [
          {
            currency: "eur",
            amount: penaltyArticle.laundryPrice * 100,
            quantity: 1,
            parent: penaltyArticle.stripeSkuId!
          }
        ]
      });
      let order = await this._orderRepository.getOrderById(orderId);
      await stripe.orders.pay(stripeOrder.id, {
        customer: order!.paymentAccount.stripeCustomerId,
        email: order!.member.person.email
      });
    }
  }

  public async payOrder(orderId: number): Promise<void> {

    let order = await this._orderRepository.getOrderById(orderId);
    if (!order)
      throw new exception.OrderNotFoundException(orderId);

    if (!order.stripeOrderId)
      throw new exception.OrderNotValidatedException(orderId);

    let stripe = getStripeInstance();

    await stripe.orders.pay(order.stripeOrderId, {
      customer: order.paymentAccount.stripeCustomerId,
      email: order.member.person.email
    });
    
  }

  private async createStripeOrder(memberFullName: string, orderAddress: string, items?: OrderItem[], weight?: number): Promise<Stripe.orders.IOrder | undefined> {

    let stripe = getStripeInstance();

    let stripeOrder: Stripe.orders.IOrder | undefined = undefined;

    if (items) {
      stripeOrder = await stripe.orders.create({
        currency: "eur",
        items: items
          .filter(item => item.article.stripeSkuId) // Defense, all items should have a stripeSkuId
          .map(item => {
            return {
              currency: "eur",
              amount: item.article.laundryPrice * 100,
              quantity: item.quantity,
              parent: item.article.stripeSkuId!,
            }
        }),
        shipping: {
          name: memberFullName,
          address: {
            line1: orderAddress
          }
        }
      });
    } else {
      let weightedArticle = await this._articleRepository.getWeightedArticle();
      if (weightedArticle) {
        stripeOrder = await stripe.orders.create({
          currency: "eur",
          items: [
            {
              currency: "eur",
              amount: weightedArticle.laundryPrice * 100 * weight!,
              parent: weightedArticle.stripeSkuId!,
            }
          ]
        });
      }
    }

    return stripeOrder;

  }

}