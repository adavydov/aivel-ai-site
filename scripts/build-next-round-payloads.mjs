import { readFile, writeFile } from "node:fs/promises";
import { createHash, webcrypto } from "node:crypto";
const { subtle } = webcrypto;
const from64 = (v) => Buffer.from(v, "base64");
const encrypt = async (payload, password, aad) => {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const material = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 900000 }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(aad), tagLength: 128 }, key, new TextEncoder().encode(JSON.stringify(payload)));
  return { version: 1, cipher: "AES-GCM-256", kdf: "PBKDF2-SHA-256", iterations: 900000, salt: Buffer.from(salt).toString("base64"), iv: Buffer.from(iv).toString("base64"), aad, ciphertext: Buffer.from(ciphertext).toString("base64") };
};
const decrypt = async (envelope, password) => {
  const material = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: from64(envelope.salt), iterations: envelope.iterations }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const plaintext = await subtle.decrypt({ name: "AES-GCM", iv: from64(envelope.iv), additionalData: new TextEncoder().encode(envelope.aad), tagLength: 128 }, key, from64(envelope.ciphertext));
  return JSON.parse(new TextDecoder().decode(plaintext));
};
const [legacyPassword, v1Password, v2Password, bodyPath] = process.argv.slice(2);
if (!legacyPassword || !v1Password || !v2Password || !bodyPath) throw new Error("usage: legacy v1 v2 bodyPath");
const legacy = JSON.parse(await readFile(new URL("../next-round/payload.json", import.meta.url), "utf8"));
const v1 = await decrypt(legacy, legacyPassword);
const v1Hash = createHash("sha256").update(v1.body).digest("hex");
if (v1Hash !== "71d823006f683a1551081c5c77ab0bf71c89ba6a327df22fc8b2df53db3a8ecf") throw new Error("V1 body hash mismatch");
const body = (await readFile(bodyPath, "utf8")).trim();
if ((body.match(/class="v2-chapter/g) || []).length !== 6) throw new Error("V2 must contain exactly six chapters");
await writeFile(new URL("../next-round/payload-v1.json", import.meta.url), JSON.stringify(await encrypt(v1, v1Password, "aivel-next-round:v1"), null, 2) + "\n");
await writeFile(new URL("../next-round/payload-v2.json", import.meta.url), JSON.stringify(await encrypt({ title: "Aivel — следующий раунд", body }, v2Password, "aivel-next-round:v2"), null, 2) + "\n");
console.log(`V1 body verified: ${v1Hash}; V2 chapters: 6`);
