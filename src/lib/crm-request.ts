import { createHmac } from "node:crypto";

export type CrmDelivery = { ok: true } | { ok: false; reason: "not_configured" | "rejected" | "unreachable" };

/**
 * Hands a lesson request to the studio's CRM, where it shows up under
 * "Gelen aramalar" with a 📬 (CRM: POST /api/webhooks/web-request). The body
 * is signed with the shared secret over `${timestamp}.${body}`; the CRM
 * rejects anything unsigned or older than five minutes. One retry on a
 * network error or a 5xx: the request id makes a repeat land on the same row.
 * Server-only: imported from the server actions, never from a client file.
 */
export async function sendRequestToCrm(payload: unknown): Promise<CrmDelivery> {
  const url = process.env.REGISTRATION_WEBHOOK_URL;
  const secret = process.env.REGISTRATION_WEBHOOK_SECRET;
  if (!url || !secret) return { ok: false, reason: "not_configured" };

  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-zenn-timestamp": String(timestamp),
          "x-zenn-signature": `sha256=${signature}`,
        },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return { ok: true };
      // A 4xx will not get better on a retry (bad signature, bad payload).
      if (res.status < 500) return { ok: false, reason: "rejected" };
    } catch {
      // Network error or timeout: try once more.
    }
  }
  return { ok: false, reason: "unreachable" };
}
