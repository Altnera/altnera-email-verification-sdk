import { VerifyResponse } from "./types";

export function normalizeScore(score: number): number {
  const v = Math.max(0, Math.min(1, score));
  return Math.round(v * 10_000) / 10_000;
}

export function riskLabel(resp: VerifyResponse): "low" | "medium" | "high" {
  const s = normalizeScore(resp.score);
  if (s >= 0.9 && resp.checks.mxRecords && resp.checks.syntax) return "low";
  if (s >= 0.6 && !resp.checks.disposable && !resp.checks.roleAddress) return "medium";
  return "high";
}

export function isLikelyDeliverable(resp: VerifyResponse): boolean {
  return normalizeScore(resp.score) >= 0.9 && resp.status === "deliverable";
}
