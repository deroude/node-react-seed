// https://dev.to/kdhttps/appauth-js-integration-in-react-1m3e

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
  AuthorizationRequest,
} from "@openid/appauth";
import jwt from "jwt-decode";

import { BasicQueryStringUtils } from "@openid/appauth";
import { FetchParams, RequestContext } from "generated-api";

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

          let extras: any = {};
          if (request && request.internal) {
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
            process.env.REACT_APP_OPENID_ISSUER!,
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
              if (!!oResponse.idToken) {
                localStorage.setItem("id_token", oResponse.idToken);
                localStorage.setItem(
                  "email",
                  (jwt(oResponse.idToken) as any).email
                );
              }

              localStorage.setItem(
                "expiresAt",
                new Date(
                  new Date().getTime() + (oResponse.expiresIn || 0)
                ).toISOString()
              );
              props.history.push("/");
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

const authorizationHandler = new RedirectRequestHandler(
  new LocalStorageBackend(),
  new NoHashQueryStringUtils(),
  window.location,
  new DefaultCrypto()
);

export const login = () => {
  AuthorizationServiceConfiguration.fetchFromIssuer(
    process.env.REACT_APP_OPENID_ISSUER!,
    new FetchRequestor()
  ).then((response) => {
    const authRequest = new AuthorizationRequest(
      {
        client_id: process.env.REACT_APP_AUTH_CLIENT_ID!,
        redirect_uri: `${window.location.origin}/callback`,
        scope: `openid profile email ${process.env.REACT_APP_AUTH_SCOPE!}`,
        response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
        state: undefined,
        extras: { audience: "node-api" },
        // extras: environment.extra
      },
      undefined,
      true
    );
    authorizationHandler.performAuthorizationRequest(response, authRequest);
  });
};

export const authHeaderMiddleware = async (
  req: RequestContext
): Promise<FetchParams> => {
  return Promise.resolve({
    ...req,
    init: {
      ...req.init,
      headers: {
        ...(req.init.headers || {}),
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  });
};
