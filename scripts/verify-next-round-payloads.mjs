import { readFile } from "node:fs/promises";
import { createHash, webcrypto } from "node:crypto";
const { subtle } = webcrypto;
const from64 = (v) => Buffer.from(v, "base64");
async function decrypt(name, password) {
  const e = JSON.parse(await readFile(new URL(`../next-round/${name}`, import.meta.url), "utf8"));
  const material = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: from64(e.salt), iterations: e.iterations }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const bytes = await subtle.decrypt({ name: "AES-GCM", iv: from64(e.iv), additionalData: new TextEncoder().encode(e.aad), tagLength: 128 }, key, from64(e.ciphertext));
  return JSON.parse(new TextDecoder().decode(bytes));
}
const [v1Password, v2Password] = process.argv.slice(2);
const v1 = await decrypt("payload-v1.json", v1Password);
const v2 = await decrypt("payload-v2.json", v2Password);
const v1Hash = createHash("sha256").update(v1.body).digest("hex");
if (v1Hash !== "71d823006f683a1551081c5c77ab0bf71c89ba6a327df22fc8b2df53db3a8ecf") throw new Error("V1 mismatch");
if ((v2.body.match(/class="v2-chapter/g) || []).length !== 6) throw new Error("chapter count mismatch");
if ((v2.body.match(/data-ru=/g) || []).length !== (v2.body.match(/data-en=/g) || []).length) throw new Error("translation mismatch");
let rejected = false;
try { await decrypt("payload-v2.json", "definitely-wrong"); } catch { rejected = true; }
if (!rejected) throw new Error("wrong password accepted");
console.log(`OK V1=${v1Hash}; V2 chapters=6; localized nodes=${(v2.body.match(/data-ru=/g) || []).length}; wrong password rejected`);
