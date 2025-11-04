import { httpJSON } from "./http";
import { VerifyResponse, BulkVerifyResponse, KeyInfo, RotateKeyResponse } from "./types";

export interface AltneraClientOptions {
  baseUrl?: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}

export class AltneraClient {
  private apiKey: string;
  private base: string;
  private signal?: AbortSignal;

  constructor(apiKey: string, opts: AltneraClientOptions = {}) {
    if (!apiKey) throw new Error("AltneraClient: apiKey is required");
    this.apiKey = apiKey;
    this.base = (opts.baseUrl ?? "https://altnera.com").replace(/\/+$/, "");
    this.signal = opts.signal;

    if (opts.fetchImpl) {
      // @ts-ignore
      globalThis.fetch = opts.fetchImpl;
    }
  }

  async verifyEmail(email: string): Promise<VerifyResponse> {
    if (!email) throw new Error("verifyEmail: email is required");
    const url = `${this.base}/api/verify.php`;
    return httpJSON<VerifyResponse>(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: { email },
      signal: this.signal,
    });
    }

  async verifyBulk(emails: string[], opts: { concurrency?: number } = {}): Promise<BulkVerifyResponse> {
    const list = [...new Set(emails.filter(Boolean))];
    if (!list.length) return { results: [] };

    const concurrency = Math.max(1, Math.floor(opts.concurrency ?? 1));
    const chunks: string[][] = [];
    for (let i = 0; i < list.length; i += concurrency) chunks.push(list.slice(i, i + concurrency));

    const results: any[] = [];
    for (const chunk of chunks) {
      const res = await Promise.all(chunk.map(e => this.verifyEmail(e).catch(err => ({
        email: e, status: "unknown", score: 0, checks: {}, domain: e.split("@")[1] || "", reason: String(err)
      }))));
      results.push(...res);
    }
    return { results };
  }

  async getKeyInfo(): Promise<KeyInfo> {
    const url = `${this.base}/api/manage-key.php?action=info`;
    return httpJSON<KeyInfo>(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      signal: this.signal,
    });
  }

  async rotateKey(): Promise<RotateKeyResponse> {
    const url = `${this.base}/api/manage-key.php?action=rotate`;
    return httpJSON<RotateKeyResponse>(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: {},
      signal: this.signal,
    });
  }
}

export * from "./types";
export * as helpers from "./helpers";
