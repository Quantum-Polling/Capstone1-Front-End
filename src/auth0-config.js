export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || "dev-hq6c6h0lpc3rriv1.us.auth0.com",
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "CdB627Vy04krPb236mJ0icffdc9qSItw-client-id",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};
