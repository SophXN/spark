/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

const PaymentComponent = () => {
  const cardContainerRef = useRef(null);
  const cardButtonRef = useRef(null);
  const paymentStatusContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.onload = initializePayment;
    document.body.appendChild(script);

    if (script) {
      document.body.removeChild(script);
    }
  }, []);

  const initializePayment = async () => {
    const appId = "sandbox-sq0idb-ZZOBhfgIiV_wnXiSEtFdVQ";
    const locationId = "{LOCATION_ID}";

    // Required in SCA Mandated Regions: Learn more at https://developer.squareup.com/docs/sca-overview
    let payments: {
      verifyBuyer?: (
        arg0: any,
        arg1: {
          amount: string;
          billingContact: {
            givenName: string;
            familyName: string;
            email: string;
            phone: string;
            addressLines: string[];
            city: string;
            state: string;
            countryCode: string;
          };
          currencyCode: string;
          intent: string;
        },
      ) => any;
      card?: () => any;
    };
    try {
      payments = window.Square.payments(appId, locationId);
    } catch {
      paymentStatusContainerRef.current.className = "missing-credentials";
      paymentStatusContainerRef.current.style.visibility = "visible";
      return;
    }

    async function initializeCard(payments: { card: () => any }) {
      const card = await payments.card();
      await card.attach("#card-container");
      return card;
    }

    async function createPayment(token: any, verificationToken: any) {
      const body = JSON.stringify({
        locationId,
        sourceId: token,
        verificationToken,
        idempotencyKey: window.crypto.randomUUID(),
      });

      const paymentResponse = await fetch("/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (paymentResponse.ok) {
        return paymentResponse.json();
      }

      const errorBody = await paymentResponse.text();
      throw new Error(errorBody);
    }

    async function tokenize(paymentMethod: { tokenize: () => any }) {
      const tokenResult = await paymentMethod.tokenize();
      if (tokenResult.status === "OK") {
        return tokenResult.token;
      } else {
        let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
        if (tokenResult.errors) {
          errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
        }

        throw new Error(errorMessage);
      }
    }

    async function verifyBuyer(
      payments: {
        verifyBuyer: (
          arg0: any,
          arg1: {
            amount: string;
            billingContact: {
              givenName: string;
              familyName: string;
              email: string;
              phone: string;
              addressLines: string[];
              city: string;
              state: string;
              countryCode: string;
            };
            currencyCode: string;
            intent: string;
          },
        ) => any;
      },
      token: any,
    ) {
      const verificationDetails = {
        amount: "1.00",
        billingContact: {
          givenName: "John",
          familyName: "Doe",
          email: "john.doe@square.example",
          phone: "3214563987",
          addressLines: ["123 Main Street", "Apartment 1"],
          city: "London",
          state: "LND",
          countryCode: "GB",
        },
        currencyCode: "GBP",
        intent: "CHARGE",
      };

      const verificationResults = await payments.verifyBuyer(
        token,
        verificationDetails,
      );
      return verificationResults.token;
    }

    // status is either SUCCESS or FAILURE;
    function displayPaymentResults(status: string) {
      const statusContainer = document.getElementById(
        "payment-status-container",
      );
      if (statusContainer) {
        if (status === "SUCCESS") {
          statusContainer.classList.remove("is-failure");
          statusContainer.classList.add("is-success");
        } else {
          statusContainer.classList.remove("is-success");
          statusContainer.classList.add("is-failure");
        }

        statusContainer.style.visibility = "visible";
      }
    }

    async function handlePaymentMethodSubmission(
      event: { preventDefault: () => void },
      card: { tokenize: () => any },
    ) {
      event.preventDefault();
      const cardButton = document.getElementById("card-button");
      if (!cardButton) {
        throw new Error("No card button found");
      }
      try {
        // disable the submit button as we await tokenization and make a payment request.
        cardButton.disabled = true;
        const token = await tokenize(card);
        const verificationToken = await verifyBuyer(payments, token);
        const paymentResults = await createPayment(token, verificationToken);
        displayPaymentResults("SUCCESS");

        console.debug("Payment Success", paymentResults);
      } catch (e) {
        cardButton.disabled = false;
        displayPaymentResults("FAILURE");
        console.error(e.message);
      }
    }

    let card: any;
    try {
      card = await initializeCard(payments);
    } catch (e) {
      console.error("Initializing Card failed", e);
      return;
    }

    cardButtonRef.current.addEventListener(
      "click",
      async function (event: any) {
        await handlePaymentMethodSubmission(event, card);
      },
    );
  };

  return (
    <>
      <form id="payment-form">
        <div ref={cardContainerRef} id="card-container"></div>
        <button ref={cardButtonRef} id="card-button" type="button">
          Pay $1.00
        </button>
      </form>
      <div ref={paymentStatusContainerRef} id="payment-status-container"></div>
    </>
  );
};

export default PaymentComponent;
