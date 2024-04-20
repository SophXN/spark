import { type NextApiRequest, type NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const state = crypto.randomBytes(32).toString("hex");
    const basePath = "https://connect.squareupsandbox.com"; // replace with your base path
    const scopes = []; // replace with your scopes
    const url = `${basePath}/oauth2/authorize?client_id=${process.env.SQR_SANDBOX_APPLICATION_ID}&response_type=code&scope=${scopes.join("+")}&state=${state}`;
    const content = `
            <link type="text/css" rel="stylesheet" href="style.css">
            <meta name="viewport" content="width=device-width">
            <div class="wrapper">
                <a class="btn" href="${url}">
                    <strong>Authorize</strong>
                </a>
            </div>`;
    res.setHeader(
      "Set-Cookie",
      `Auth_State=${state}; Expires=${new Date(Date.now() + 300000).toUTCString()}; Path=/;`,
    );
    res.status(200).json({ content });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
