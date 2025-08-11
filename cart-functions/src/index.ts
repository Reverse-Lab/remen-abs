/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const ping = onRequest({
  region: "asia-northeast3",
}, (req, res) => {
  logger.info("ping called", {path: req.path, method: req.method});
  res.status(200).send("ok");
});
