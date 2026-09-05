import {readFile,writeFile} from "node:fs/promises";
import {createHash,webcrypto} from "node:crypto";
import path from "node:path";
import {fileURLToPath} from "node:url";

const sourcePath=process.argv[2];
const password=process.env.AIVEL_TEASER_V2_PASSWORD;
if(!sourcePath||!password)throw new Error("Provide a standalone HTML path and AIVEL_TEASER_V2_PASSWORD.");
const outputDir=fileURLToPath(new URL("../next-round/",import.meta.url));
const hash=value=>createHash("sha256").update(value).digest("hex");
const encoder=new TextEncoder();
async function keyFor(password,salt,iterations,usage){
  const material=await webcrypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveKey"]);
  return webcrypto.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt,iterations},material,{name:"AES-GCM",length:256},false,[usage]);
}
async function decrypt(envelope){
  const key=await keyFor(password,Buffer.from(envelope.salt,"base64"),envelope.iterations,"decrypt");
  const bytes=await webcrypto.subtle.decrypt({name:"AES-GCM",iv:Buffer.from(envelope.iv,"base64"),additionalData:encoder.encode(envelope.aad),tagLength:128},key,Buffer.from(envelope.ciphertext,"base64"));
  return JSON.parse(new TextDecoder().decode(bytes));
}
const priorEnvelope=JSON.parse(await readFile(path.join(outputDir,"payload-v2.json"),"utf8"));
await decrypt(priorEnvelope); // Verify reuse of the existing V2 password.
const v1Before=hash(await readFile(path.join(outputDir,"payload-v1.json")));
const source=await readFile(sourcePath,"utf8");
const styleBlocks=[...source.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)];
if(styleBlocks.length<1||styleBlocks.length>2||styleBlocks[0][1].trim()!==""||
  (styleBlocks.length===2&&!/^\s+id\s*=\s*(["'])aivel-final-consistency-20260905\1\s*$/.test(styleBlocks[1][1])))
  throw new Error("Expected the baseline stylesheet, optionally followed by aivel-final-consistency-20260905.");
const css=styleBlocks.map(block=>block[2]).join("\n");
const bodyMatch=source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
if(!bodyMatch)throw new Error("Missing presentation body.");
const body=bodyMatch[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"").trim();
if(/<script\b|<style\b|\sstyle\s*=|\son[a-z]+\s*=/i.test(body))throw new Error("Presentation body must not contain inline code.");
const ids=[...body.matchAll(/<section id="([^"]+)"/g)].map(match=>match[1]);
if(JSON.stringify(ids)!==JSON.stringify(["vision","scale","ai","model","enterprise","multiples","round"]))throw new Error("Unexpected presentation chapters.");
if((body.match(/data-ru=/g)||[]).length!==(body.match(/data-en=/g)||[]).length)throw new Error("Localization attributes do not match.");
const title=source.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
if(!title)throw new Error("Missing presentation title.");
const stylesheet="./v2-presentation.css?v="+hash(css).slice(0,12);
const payload={title,body,stylesheet};
const salt=webcrypto.getRandomValues(new Uint8Array(16));
const iv=webcrypto.getRandomValues(new Uint8Array(12));
const aad="aivel-next-round:v2";
const iterations=900000;
const key=await keyFor(password,salt,iterations,"encrypt");
const bytes=await webcrypto.subtle.encrypt({name:"AES-GCM",iv,additionalData:encoder.encode(aad),tagLength:128},key,encoder.encode(JSON.stringify(payload)));
const envelope={version:1,cipher:"AES-GCM-256",kdf:"PBKDF2-SHA-256",iterations,salt:Buffer.from(salt).toString("base64"),iv:Buffer.from(iv).toString("base64"),aad,ciphertext:Buffer.from(bytes).toString("base64")};
if(JSON.stringify(await decrypt(envelope))!==JSON.stringify(payload))throw new Error("V2 round-trip validation failed.");
await writeFile(path.join(outputDir,"v2-presentation.css"),css,"utf8");
await writeFile(path.join(outputDir,"payload-v2.json"),JSON.stringify(envelope,null,2)+"\n","utf8");
if(hash(await readFile(path.join(outputDir,"payload-v1.json")))!==v1Before)throw new Error("V1 changed unexpectedly.");
console.log(JSON.stringify({chapters:ids.length,localizedNodes:(body.match(/data-ru=/g)||[]).length,sourceSha256:hash(source),bodySha256:hash(body),cssSha256:hash(css),stylesheet,v1Unchanged:true,passwordReused:true,roundTripVerified:true}));

