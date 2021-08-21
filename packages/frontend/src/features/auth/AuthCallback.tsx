import React, { useEffect, useState } from "react";
import {
  TokenRequest,
  BaseTokenRequestHandler,
  GRANT_TYPE_AUTHORIZATION_CODE,
  AuthorizationServiceConfiguration,
  RedirectRequestHandler,
  AuthorizationNotifier,
  FetchRequestor,
  LocalStorageBackend,
  DefaultCrypto,
  LocationLike,
} from "@openid/appauth";

import { BasicQueryStringUtils } from "@openid/appauth";

class NoHashQueryStringUtils extends BasicQueryStringUtils {
  parse(input: LocationLike, useHash: boolean) {
    return super.parse(input, false /* never use hash */);
  }
}

export const Callback = (props: any) => {
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(
    function () {
      ///////////////////////////
      const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
      const authorizationHandler = new RedirectRequestHandler(
        new LocalStorageBackend(),
        new NoHashQueryStringUtils(),
        window.location,
        new DefaultCrypto()
      );
      const notifier = new AuthorizationNotifier();
      authorizationHandler.setAuthorizationNotifier(notifier);
      notifier.setAuthorizationListener((request, response, error) => {
        console.log(
          "Authorization request complete ",
          request,
          response,
          error
        );
        if (response) {
          console.log(`Authorization Code  ${response.code}`);

          let extras: any = null;
          if (request && request.internal) {
            extras = {};
            extras.code_verifier = request.internal.code_verifier;
          }

          const tokenRequest = new TokenRequest({
            client_id: process.env.REACT_APP_AUTH_CLIENT_ID!,
            redirect_uri: `${window.location.origin}/callback`,
            grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
            code: response.code,
            refresh_token: undefined,
            extras,
          });

          AuthorizationServiceConfiguration.fetchFromIssuer(
            process.env.REACT_APP_AUTH_CLIENT_ID!,
            new FetchRequestor()
          )
            .then((oResponse) => {
              const configuration = oResponse;
              return tokenHandler.performTokenRequest(
                configuration,
                tokenRequest
              );
            })
            .then((oResponse) => {
              localStorage.setItem("access_token", oResponse.accessToken);
              props.history.push("/profile");
            })
            .catch((oError) => {
              setError(oError);
            });
        }
      });

      //////////////////////////
      const params = new URLSearchParams(props.location.search);
      setCode(params.get("code"));

      if (!code) {
        setError("Unable to get authorization code");
        return;
      }
      authorizationHandler.completeAuthorizationRequestIfPossible();
    },
    [code, props]
  );

  return (
    <div className="container-fluid" style={{ marginTop: "10px" }}>
      <div className="card">
        {code ? (
          <div className="card-body">
            <h5 className="card-title">Loading...</h5>
          </div>
        ) : (
          <div className="card-body bg-danger">
            <div className="card-body">
              <p className="card-text">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
