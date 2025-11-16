import { CredentialManager, XRPC } from "@atcute/client";

import { LEAFLET_PDS } from "#/lib/config";

const handler = new CredentialManager({
  service: `https://${LEAFLET_PDS}`,
  fetch,
});

export const leafletBsky = new XRPC({ handler });
