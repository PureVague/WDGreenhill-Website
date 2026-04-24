import type { Metadata } from "next";
import { CheckoutSuccess } from "./CheckoutSuccess";

export const metadata: Metadata = {
  title: "Order Confirmed — Thank You",
  description: "Your order with WD Greenhill & Co has been confirmed.",
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccess />;
}
