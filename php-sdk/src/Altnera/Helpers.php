<?php
namespace Altnera;

class Helpers {
  public static function normalizeScore(float $score): float {
    $v = max(0, min(1, $score));
    return round($v, 4);
  }

  public static function riskLabel(array $resp): string {
    $s = self::normalizeScore((float)($resp['score'] ?? 0));
    $checks = $resp['checks'] ?? [];
    $mx = !empty($checks['mxRecords']);
    $syntax = !empty($checks['syntax']);
    $disposable = !empty($checks['disposable']);
    $role = !empty($checks['roleAddress']);
    if ($s >= 0.9 && $mx && $syntax) return 'low';
    if ($s >= 0.6 && !$disposable && !$role) return 'medium';
    return 'high';
  }

  public static function isLikelyDeliverable(array $resp): bool {
    return self::normalizeScore((float)($resp['score'] ?? 0)) >= 0.9
      && (($resp['status'] ?? '') === 'deliverable');
  }
}
