/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseAdmin: SupabaseClient = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

export const updatePaymentLinkStatus = async (
  orderId: string,
  paymentStatus: string,
) => {
  // Find the payment link
  const { data: paymentLink, error: findError } = await supabaseAdmin
    .from("paymentLink")
    .select("*")
    .eq("squareOrderId", orderId)
    .single();

  if (findError) {
    throw new Error(`Failed to find payment link: ${findError.message}`);
  }

  if (!paymentLink) {
    throw new Error("Payment link not found, cannot update status");
  }

  // Update the payment link
  const { error: updateError } = await supabaseAdmin
    .from("paymentLink")
    .update({ paymentStatus })
    .eq("id", paymentLink.id);

  if (updateError) {
    throw new Error(`Failed to update payment link: ${updateError.message}`);
  }

  console.log(`Payment link updated: ${paymentLink.id}`);
  return paymentLink.id;
};
