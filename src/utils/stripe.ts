import Stripe from "stripe";
import { getConfig } from "../config";


export function getStripeInstance(): Stripe {
  let stripeApiKey = getConfig().stripeConfig[process.env.NODE_ENV || "local"].apiKey;
  return new Stripe(stripeApiKey);
}