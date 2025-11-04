cd php-sdk
composer validate
[# Submit the repo URL to Packagist after pushing to GitHub](https://github.com/Altnera/altnera-email-verification-sdk/tree/main/php-sdk)
-----------------------------------------------------------
use Altnera\Client;
use Altnera\Helpers;

$client = new Client($_ENV['ALTNERA_API_KEY']);
$result = $client->verifyEmail('name@company.com');
echo Helpers::riskLabel($result);
