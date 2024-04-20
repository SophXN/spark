// components/AuthorizationMessages.tsx

import React from "react";

interface SuccessProps {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  merchantId: string;
}

export const SuccessMessage: React.FC<SuccessProps> = ({
  accessToken,
  refreshToken,
  expiresAt,
  merchantId,
}) => {
  return (
    <div className="messages">
      <h1>Authorization Succeeded</h1>
      <div className="wrapper">
        <div className="messages">
          <h1>Authorization Succeeded</h1>
          <div className="color:rgba(204, 0, 35, 1)">
            <strong>Caution:</strong> NEVER store or share OAuth access tokens
            or refresh tokens in clear text. Use a strong encryption standard
            such as AES to encrypt OAuth tokens. Ensure the production
            encryption key is not accessible to anyone who does not need it.
          </div>
          <br />
          <div>
            <strong>OAuth access token:</strong> ${accessToken}{" "}
          </div>
          <div>
            <strong>OAuth access token expires at:</strong> ${expiresAt}{" "}
          </div>
          <div>
            <strong>OAuth refresh token:</strong> ${refreshToken}{" "}
          </div>
          <div>
            <strong>Merchant Id:</strong> ${merchantId}{" "}
          </div>
          <div>
            <p>
              You can use this OAuth access token to call Create Payment and
              other APIs that were authorized by this seller.
            </p>
            <p>
              Try it out with{" "}
              <a
                href="https://developer.squareup.com/explorer/square/payments-api/create-payment"
                target="_blank"
              >
                API Explorer
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StateErrorMessage: React.FC = () => {
  return (
    <div className="messages">
      <h1>Authorization failed</h1>
      <div>Invalid state parameter.</div>
    </div>
  );
};

interface ErrorProps {
  error: string;
  errorDescription: string;
}

export const ErrorMessage: React.FC<ErrorProps> = ({
  error,
  errorDescription,
}) => {
  return (
    <div className="messages">
      <h1>Authorization failed</h1>
      <div>Error: {error}</div>
      <div>Error Details: {errorDescription}</div>
    </div>
  );
};
