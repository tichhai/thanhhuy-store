import * as jose from "jose";
import { createHash } from "crypto";

interface JWEPayload {
  [key: string]: any;
}

async function decryptJWE(
  token: string,
  secret: string
): Promise<JWEPayload | null> {
  try {
    const key = new Uint8Array(createHash("sha256").update(secret).digest());

    const { payload } = await jose.jwtDecrypt(token, key);

    console.log("Decrypted Payload:", payload);
    return payload as JWEPayload;
  } catch (error) {
    console.error("Error decrypting JWE:", (error as Error).message);
    return null;
  }
}

const token: string =
  "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..6D0pQUgncZ8Y3x69.eJUQ1nCHkkdJhGXLV-ywui7tO06bqle_1UmiVWue1ZbuYK5QhIi_9Mm2_SY2ghKoYD00hClbTlv1mOe68l-LMjHg6DlpgGMQ8HOaODuRlcP8ySOKtqVAwqVW9z7Fnhzxcp6KMWavQGjY0OdWJnUluPN2MJoeXwaL4TS0HwU3pbiv4wRNoac50xR_jADdvUvpMF-3wuc_GRl1Zmnx9_TOts8jQ1KbRFW1NIiGdL3AGgXctEfm.zMeVAG01QZayHlqUjyX9Sg";
const secret: string = "apple-shop-jwt";

(async () => {
  const payload = await decryptJWE(token, secret);
  if (payload) {
    console.log("Successfully decrypted:", payload);
  } else {
    console.log("Failed to decrypt token.");
  }
})();
