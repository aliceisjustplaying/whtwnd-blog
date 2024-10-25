import { CredentialManager, XRPC } from "@atcute/client";

import { MY_PDS } from "./config";

const handler = new CredentialManager({ service: `https://${MY_PDS}`, fetch });
export const bsky = new XRPC({ handler });
