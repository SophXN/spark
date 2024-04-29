/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextApiRequest, type NextApiResponse } from "next";
import { WebhooksHelper } from "square";
import { createCaller } from "../../../server/api/root"; // replace with the actual path to root.ts
import { createTRPCContext } from "~/server/api/trpc";

// The URL where event notifications are sent.
const NOTIFICATION_URL =
  "https://spark-square.vercel.app/api/webhooks/orders-status";

// The signature key defined for the subscription.
const SIGNATURE_KEY = process.env.WEBHOOK_SIGNATURE_KEY;

// isFromSquare generates a signature from the url and body and compares it to the Square signature header.
function isFromSquare(signature: string, body: string): boolean {
  if (!SIGNATURE_KEY) {
    console.error("SIGNATURE_KEY is not set.");
    return false;
  }
  return WebhooksHelper.isValidWebhookEventSignature(
    body,
    signature,
    SIGNATURE_KEY,
    NOTIFICATION_URL,
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const body = JSON.stringify(req.body);
    const signature = req.headers["x-square-hmacsha256-signature"] as string;
    if (isFromSquare(signature, body)) {
      res
        .status(200)
        .json({ message: `hihihi ${req.body.data.object.payment.status}` });
      const orderId = req.body.data.id as string;
      const paymentOrderId = req.body.data.object.payment.order_id as string;
      const paymentStatus = req.body.data.object.payment.status as string;
      const context = await createTRPCContext({
        req,
        res,
        info: {
          isBatchCall: false,
          calls: [],
        },
      });
      const trpc = createCaller(context);
      switch (req.body.data.type) {
        case req.body.data.type === "order_fulfillment_updated":
          await trpc.sponsors.updateSponsorPaymentStatus({ orderId });
          break;
        case req.body.data.type === "payment.updated":
          await trpc.sponsors.updatePaymentLinkStatus({
            orderId: paymentOrderId,
            paymentStatus: paymentStatus,
          }); // technically this is the paymentId
          break;
        default:
          break;
      }
      console.info("Request body: " + body);
    } else {
      // Signature is invalid. Return 403 Forbidden.
      res.status(403).end();
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// if (req.body.data.type === "order_fulfillment_updated") {
//   // const orderId = req.body.data.id as string;
//   // mutation.mutate({ orderId });
// }
// const mutation = api.sponsors.updateSponsorPaymentStatus.useMutation();
// if (req.body.data.type === "order_fulfillment_updated") {
//   const orderId = req.body.data.id as string;
//   mutation.mutate({ orderId });
// }

// {
//   "merchant_id": "6SSW7HV8K2ST5",
//   "type": "payment.updated",
//   "event_id": "6a8f5f28-54a1-4eb0-a98a-3111513fd4fc",
//   "created_at": "2020-02-06T21:27:34.308Z",
//   "data": {
//     "type": "payment",
//     "id": "hYy9pRFVxpDsO1FB05SunFWUe9JZY",
//     "object": {
//       "payment": {
//         "amount_money": {
//           "amount": 100,
//           "currency": "USD"
//         },
//         "approved_money": {
//           "amount": 100,
//           "currency": "USD"
//         },
//         "card_details": {
//           "avs_status": "AVS_ACCEPTED",
//           "card": {
//             "bin": "540988",
//             "card_brand": "MASTERCARD",
//             "card_type": "CREDIT",
//             "exp_month": 11,
//             "exp_year": 2022,
//             "fingerprint": "sq-1-Tvruf3vPQxlvI6n0IcKYfBukrcv6IqWr8UyBdViWXU2yzGn5VMJvrsHMKpINMhPmVg",
//             "last_4": "9029",
//             "prepaid_type": "NOT_PREPAID"
//           },
//           "card_payment_timeline": {
//             "authorized_at": "2020-11-22T21:16:51.198Z",
//             "captured_at": "2020-11-22T21:19:00.832Z"
//           },
//           "cvv_status": "CVV_ACCEPTED",
//           "entry_method": "KEYED",
//           "statement_description": "SQ *DEFAULT TEST ACCOUNT",
//           "status": "CAPTURED"
//         },
//         "created_at": "2020-11-22T21:16:51.086Z",
//         "delay_action": "CANCEL",
//         "delay_duration": "PT168H",
//         "delayed_until": "2020-11-29T21:16:51.086Z",
//         "id": "hYy9pRFVxpDsO1FB05SunFWUe9JZY",
//         "location_id": "S8GWD5R9QB376",
//         "order_id": "03O3USaPaAaFnI6kkwB1JxGgBsUZY",
//         "receipt_number": "hYy9",
//         "receipt_url": "https://squareup.com/receipt/preview/hYy9pRFVxpDsO1FB05SunFWUe9JZY",
//         "risk_evaluation": {
//           "created_at": "2020-11-22T21:16:51.198Z",
//           "risk_level": "NORMAL"
//         },
//         "source_type": "CARD",
//         "status": "COMPLETED",
//         "total_money": {
//           "amount": 100,
//           "currency": "USD"
//         },
//         "updated_at": "2020-11-22T21:19:00.831Z",
//         "version_token": "bhC3b8qKJvNDdxqKzXaeDsAjS1oMFuAKxGgT32HbE6S6o"
//       }
//     }
//   }
// }
