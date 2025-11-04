
---

## 🟦 **`js-sdk/README.md`**

```md
# Altnera Email Verification SDK (JavaScript / TypeScript)

Official JavaScript/TypeScript SDK for the [Altnera Email Verification API](https://altnera.com/api/docs).  
Works seamlessly in both **Node.js** and **browser** environments.

---

## 🚀 Installation

```bash
npm install @altnera/email-verification
# or
yarn add @altnera/email-verification

Configuration

Base URL: https://altnera.com
Verify endpoint: /api/verify.php
Auth header: Authorization: Bearer <API_KEY>
import { AltneraClient, helpers } from "@altnera/email-verification";

const client = new AltneraClient(process.env.ALTNERA_API_KEY!, {
  baseUrl: "https://altnera.com"
});

// Single verification
const res = await client.verifyEmail("name@company.com");
console.log(res.status, res.score, helpers.riskLabel(res));

// Bulk verification
const bulk = await client.verifyBulk(["a@x.com", "b@y.com"], { concurrency: 3 });
console.table(bulk.results.map(r => ({
  email: r.email,
  score: r.score,
  risk: helpers.riskLabel(r)
})));

// Key management
const info = await client.getKeyInfo();
console.log("Key active:", info.active);
