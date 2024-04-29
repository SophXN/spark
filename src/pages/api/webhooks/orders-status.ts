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
      if (req.body.data.type === "order_fulfillment_updated") {
        const orderId = req.body.data.id as string;
        const context = await createTRPCContext({
          req,
          res,
          info: {
            isBatchCall: false,
            calls: [],
          },
        }); // replace with the actual path to trpc.ts
        const trpc = createCaller(context);
        await trpc.sponsors.updateSponsorPaymentStatus({ orderId });
      }
      res.status(200).end();
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
