# Altnera Email Verification SDK (PHP)

Official PHP SDK for the Altnera Email Verification API.

## Install (after Packagist submission)
```bash
composer require altnera/email-verification
```

## Usage
```php
use Altnera\Client;
use Altnera\Helpers;

$client = new Client(getenv('ALTNERA_API_KEY'));
$res = $client->verifyEmail('name@company.com');
echo Helpers::riskLabel($res);
```
