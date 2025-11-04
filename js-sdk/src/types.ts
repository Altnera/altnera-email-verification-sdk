export type VerificationStatus = "deliverable" | "undeliverable" | "risky" | "unknown";

export interface VerificationChecks {
  syntax: boolean;
  mxRecords: boolean;
  dnsResolved: boolean;
  smtp: boolean;
  disposable: boolean;
  roleAddress: boolean;
  freeProvider: boolean;
  [k: string]: boolean | undefined;
}

export interface VerifyResponse {
  email: string;
  status: VerificationStatus | string;
  score: number;
  checks: VerificationChecks;
  domain: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface BulkVerifyResponse { results: VerifyResponse[]; }

export interface KeyInfo {
  key_last_four: string;
  created_at: string;
  last_used_at?: string;
  scopes?: string[];
  active: boolean;
}

export interface RotateKeyResponse {
  api_key: string;
  rotated_at: string;
}
