# Altnera Email Verification SDK (PHP)

Official PHP SDK for the [Altnera Email Verification API](https://altnera.com/api/docs).

Easily verify email deliverability, perform bulk checks, and manage API keys using a simple PHP client.

---

## 🚀 Installation

After the package is published on [Packagist](https://packagist.org/):

```bash
composer require altnera/email-verification

Or, if developing locally:

cd php-sdk
composer install


Configuration
Base URL: https://altnera.com
Verify endpoint: /api/verify.php
Auth header: Authorization: Bearer <API_KEY>

Usage Example
<?php
require __DIR__ . '/vendor/autoload.php';

use Altnera\Client;
use Altnera\Helpers;

$client = new Client(getenv('ALTNERA_API_KEY'));

// Single email verification
$response = $client->verifyEmail('name@company.com');
echo 'Status: ' . $response['status'] . PHP_EOL;
echo 'Risk: ' . Helpers::riskLabel($response) . PHP_EOL;

// Bulk verification
$bulk = $client->verifyBulk(['a@x.com', 'b@y.com']);
print_r($bulk['results']);

// Key management
$info = $client->getKeyInfo();
print_r($info);
