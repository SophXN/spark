import React, { useEffect, useRef } from "react";

const PaymentComponent = () => {
  const cardButtonRef = useRef(null);
  const statusContainerRef = useRef(null);

  useEffect(() => {
    const appId = "sandbox-sq0idb-ZZOBhfgIiV_wnXiSEtFdVQ";
    const locationId = "{LOCATION_ID}";

    // ... rest of the code from the script tag ...

    if (!window.Square) {
      throw new Error("Square.js failed to load properly");
    }

    let payments;
    try {
      payments = window.Square.payments(appId, locationId);
    } catch {
      const statusContainer = statusContainerRef.current;
      statusContainer.className = "missing-credentials";
      statusContainer.style.visibility = "visible";
      return;
    }

    let card;
    try {
      card = initializeCard(payments);
    } catch (e) {
      console.error("Initializing Card failed", e);
      return;
    }

    const cardButton = cardButtonRef.current;
    cardButton.addEventListener("click", async function (event) {
      await handlePaymentMethodSubmission(event, card);
    });
  }, []);

  return (
    <div>
      <form id="payment-form">
        <div id="card-container"></div>
        <button ref={cardButtonRef} id="card-button" type="button">
          Pay $1.00
        </button>
      </form>
      <div ref={statusContainerRef} id="payment-status-container"></div>
    </div>
  );
};

export default PaymentComponent;
