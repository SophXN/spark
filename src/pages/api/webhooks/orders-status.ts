import Cors from "micro-cors";
import { type NextApiRequest, type NextApiResponse } from "next";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

// export async function POST(req: Request) {
//   try {
//     const body = await req.text();

//     const signature = headers().get("x-square-signature");
//     console.log("Signature", signature);
//     console.log("Body", body);
//     // return 200 status code
//     return NextResponse.json(
//       {
//         message: "success",
//         ok: true,
//       },
//       { status: 200 },
//     );
//     // return NextResponse.next();
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         message: "something went wrong",
//         ok: false,
//       },
//       { status: 500 },
//     );
//   }
// }

// The URL where event notifications are sent.
const NOTIFICATION_URL =
  "https://spark-square.vercel.app/api/webhooks/order-status";

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
      // Signature is valid. Return 200 OK.
      res.status(200).end();
      console.info("Request body: " + body);
    } else {
      // Signature is invalid. Return 403 Forbidden.
      res.status(403).end();
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
