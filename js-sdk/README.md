# Altnera Email Verification SDK (JS/TS)

Official JavaScript/TypeScript SDK for the Altnera Email Verification API (Node.js + Browser).

## Install
```bash
npm i @altnera/email-verification
```

## Usage
```ts
import { AltneraClient, helpers } from "@altnera/email-verification";
const client = new AltneraClient(process.env.ALTNERA_API_KEY!, { baseUrl: "https://altnera.com" });
const res = await client.verifyEmail("name@company.com");
console.log(res.status, helpers.riskLabel(res));
```
