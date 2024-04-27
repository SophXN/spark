import Cors from "micro-cors";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const signature = headers().get("x-square-signature");
    console.log("Signature", signature);
    console.log("Body", body);
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 },
    );
  }
}
