<?php
namespace Altnera;

class Client {
  private string $apiKey;
  private string $base;

  public function __construct(string $apiKey, string $baseUrl = 'https://altnera.com') {
    if (!$apiKey) {
      throw new \InvalidArgumentException('Altnera Client: apiKey is required');
    }
    $this->apiKey = $apiKey;
    $this->base = rtrim($baseUrl, '/');
  }

  public function verifyEmail(string $email): array {
    if (!$email) { throw new \InvalidArgumentException('verifyEmail: email is required'); }
    $url = $this->base . '/api/verify.php';
    return $this->request('POST', $url, ['email' => $email]);
  }

  public function verifyBulk(array $emails): array {
    $unique = array_values(array_unique(array_filter($emails)));
    $out = [];
    foreach ($unique as $e) {
      try {
        $out[] = $this->verifyEmail($e);
      } catch (\Throwable $t) {
        $parts = explode('@', $e, 2);
        $out[] = [
          'email' => $e,
          'status' => 'unknown',
          'score' => 0,
          'checks' => new \stdClass(),
          'domain' => $parts[1] ?? '',
          'reason' => $t->getMessage(),
        ];
      }
    }
    return ['results' => $out];
  }

  public function getKeyInfo(): array {
    $url = $this->base . '/api/manage-key.php?action=info';
    return $this->request('GET', $url);
  }

  public function rotateKey(): array {
    $url = $this->base . '/api/manage-key.php?action=rotate';
    return $this->request('POST', $url, []);
  }

  private function request(string $method, string $url, ?array $json = null): array {
    $ch = curl_init($url);
    $headers = ['Authorization: Bearer ' . $this->apiKey];
    if ($json !== null) {
      $headers[] = 'Content-Type: application/json';
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json));
    }
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_CUSTOMREQUEST => $method,
      CURLOPT_HTTPHEADER => $headers,
      CURLOPT_TIMEOUT => 30,
    ]);
    $raw = curl_exec($ch);
    if ($raw === false) {
      $err = curl_error($ch);
      curl_close($ch);
      throw new \RuntimeException('HTTP error: ' . $err);
    }
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = json_decode($raw, true);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
      $data = ['raw' => $raw];
    }
    if ($status < 200 || $status >= 300) {
      $msg = $data['message'] ?? $data['error'] ?? ('HTTP ' . $status);
      throw new \RuntimeException($msg, $status);
    }
    return $data;
  }
}
