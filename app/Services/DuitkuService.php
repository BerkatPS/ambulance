<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DuitkuService
{
    /**
     * The Duitku API base URL.
     *
     * @var string
     */
    protected $baseUrl;

    /**
     * The Duitku merchant code.
     *
     * @var string
     */
    protected $merchantCode;

    /**
     * The Duitku API key.
     *
     * @var string
     */
    protected $apiKey;

    /**
     * Create a new service instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->baseUrl = config('services.duitku.base_url', 'https://sandbox.duitku.com/webapi');
        $this->merchantCode = config('services.duitku.merchant_code', 'YOUR_MERCHANT_CODE');
        $this->apiKey = config('services.duitku.api_key', 'YOUR_API_KEY');
    }

    /**
     * Create a payment request for custom payment flow.
     *
     * @param string $merchantOrderId
     * @param int $amount
     * @param string $productDetails
     * @param string $email
     * @param string $customerName
     * @param string $phoneNumber
     * @param string $paymentMethod
     * @param string $callbackUrl
     * @return array
     */
    public function createPaymentRequest(
        string $merchantOrderId,
        int $amount,
        string $productDetails,
        string $email,
        string $customerName,
        string $phoneNumber,
        string $paymentMethod,
        string $callbackUrl
    ): array {
        try {
            // Generate signature
            $signature = $this->generateSignature($merchantOrderId, $amount);
            
            // Prepare request data
            $requestData = [
                'merchantCode' => $this->merchantCode,
                'paymentAmount' => $amount,
                'paymentMethod' => $paymentMethod,
                'merchantOrderId' => $merchantOrderId,
                'productDetails' => $productDetails,
                'customerVaName' => $customerName,
                'email' => $email,
                'phoneNumber' => $phoneNumber,
                'callbackUrl' => $callbackUrl,
                'returnUrl' => route('bookings.index'),
                'signature' => $signature,
                'expiryPeriod' => 1440 // 24 hours in minutes
            ];
            
            // Make API request
            $response = Http::post($this->baseUrl . '/api/merchant/v2/inquiry', $requestData);
            $responseData = $response->json();
            
            // Log the API response
            Log::info('Duitku payment request', [
                'reference' => $merchantOrderId,
                'response' => $responseData
            ]);
            
            // Check for errors
            if (!$response->successful() || isset($responseData['statusCode']) && $responseData['statusCode'] != '00') {
                throw new \Exception('Payment gateway error: ' . ($responseData['statusMessage'] ?? 'Unknown error'));
            }
            
            // Return formatted response for our custom flow
            return [
                'reference' => $responseData['reference'],
                'paymentUrl' => $responseData['paymentUrl'],
                'vaNumber' => $responseData['vaNumber'] ?? null,
                'qrString' => $responseData['qrString'] ?? null,
                'amount' => $amount,
                'paymentMethod' => $paymentMethod,
                'statusCode' => $responseData['statusCode'],
                'statusMessage' => $responseData['statusMessage']
            ];
        } catch (\Exception $e) {
            Log::error('Duitku payment request failed', [
                'reference' => $merchantOrderId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }

    /**
     * Create a payment transaction.
     *
     * @param  array  $paymentData
     * @return array
     */
    public function createPayment(array $paymentData): array
    {
        try {
            // Generate signature
            $signature = $this->generateSignature($paymentData['merchantOrderId'], $paymentData['paymentAmount']);

            // Add signature to request data
            $requestData = array_merge($paymentData, [
                'signature' => $signature,
                'expiryPeriod' => $paymentData['expiryPeriod'] ?? 60, // Default 60 minutes
            ]);

            // Make API request
            $response = Http::post($this->baseUrl . '/api/merchant/v2/inquiry', $requestData);
            $responseData = $response->json();

            // Log the API response
            Log::info('Duitku payment API response', [
                'reference' => $paymentData['merchantOrderId'],
                'response' => $responseData
            ]);

            // Check for errors
            if (!$response->successful() || isset($responseData['statusCode']) && $responseData['statusCode'] != '00') {
                throw new \Exception('Payment gateway error: ' . ($responseData['statusMessage'] ?? 'Unknown error'));
            }

            // Return formatted response
            return [
                'transaction_id' => $responseData['reference'] ?? null,
                'payment_url' => $responseData['paymentUrl'] ?? null,
                'status' => 'pending',
                'reference_number' => $paymentData['merchantOrderId'],
                'gateway_response' => $responseData,
            ];
        } catch (\Exception $e) {
            Log::error('Duitku payment creation failed', [
                'reference' => $paymentData['merchantOrderId'] ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Check payment status.
     *
     * @param  string  $merchantOrderId
     * @return array
     */
    public function checkPaymentStatus(string $merchantOrderId): array
    {
        try {
            // Generate signature
            $signature = md5($this->merchantCode . $merchantOrderId . $this->apiKey);

            // Prepare request data
            $requestData = [
                'merchantCode' => $this->merchantCode,
                'merchantOrderId' => $merchantOrderId,
                'signature' => $signature
            ];

            // Make API request
            $response = Http::post($this->baseUrl . '/api/merchant/transactionStatus', $requestData);
            $responseData = $response->json();

            // Log the API response
            Log::info('Duitku transaction status check', [
                'reference' => $merchantOrderId,
                'response' => $responseData
            ]);

            // Check for errors
            if (!$response->successful() || isset($responseData['statusCode']) && $responseData['statusCode'] != '00') {
                throw new \Exception('Payment status check error: ' . ($responseData['statusMessage'] ?? 'Unknown error'));
            }

            // Return formatted response
            return [
                'status' => $this->mapGatewayStatus($responseData['transactionStatus'] ?? 'PENDING'),
                'amount' => $responseData['amount'] ?? null,
                'reference_number' => $merchantOrderId,
                'transaction_id' => $responseData['reference'] ?? null,
                'payment_method' => $responseData['paymentCode'] ?? null,
                'gateway_response' => $responseData,
            ];
        } catch (\Exception $e) {
            Log::error('Duitku payment status check failed', [
                'reference' => $merchantOrderId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Check transaction status with Duitku.
     *
     * @param string $reference
     * @return array
     */
    public function checkTransactionStatus(string $reference): array
    {
        try {
            // Dalam lingkungan lokal, kita bisa menggunakan mock data
            // Ini membantu pengembangan tanpa harus selalu terhubung ke API Duitku
            if (app()->environment('local')) {
                Log::info('Menggunakan mock data untuk pengujian status transaksi Duitku di lingkungan lokal');
                
                return [
                    'statusCode' => '00',
                    'statusMessage' => 'SUCCESS',
                    'amount' => 100000,
                    'reference' => $reference,
                    'merchantOrderId' => 'ORDER-' . substr($reference, -8),
                    'paymentCode' => 'BCA',
                    'transactionStatus' => 'SUCCESS'
                ];
            }
            
            // Generate signature
            $signature = md5($this->merchantCode . $reference . $this->apiKey);
            
            // Prepare request data
            $requestData = [
                'merchantCode' => $this->merchantCode,
                'reference' => $reference,
                'signature' => $signature
            ];
            
            // Make API request
            $response = Http::post($this->baseUrl . '/api/merchant/transactionStatus', $requestData);
            $responseData = $response->json();
            
            // Log the API response
            Log::info('Duitku transaction status check by reference', [
                'reference' => $reference,
                'response' => $responseData
            ]);
            
            return $responseData;
        } catch (\Exception $e) {
            Log::error('Duitku transaction status check failed', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);
            
            // Untuk error handling, kita bisa mengembalikan status default
            // untuk mencegah aplikasi crash
            return [
                'statusCode' => '01',
                'statusMessage' => 'Error: ' . $e->getMessage(),
                'reference' => $reference
            ];
        }
    }

    /**
     * Validate callback data from Duitku.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function validateCallback($request): array
    {
        try {
            // Get callback data
            $callbackData = $request->all();
            
            // Log the callback data
            Log::info('Duitku callback received', [
                'data' => $callbackData
            ]);
            
            // Calculate expected signature
            $merchantCode = $callbackData['merchantCode'] ?? '';
            $amount = $callbackData['amount'] ?? 0;
            $reference = $callbackData['reference'] ?? '';
            $signature = $callbackData['signature'] ?? '';
            
            $expectedSignature = md5($merchantCode . $amount . $reference . $this->apiKey);
            
            // Verify signature
            if ($signature !== $expectedSignature) {
                throw new \Exception('Invalid callback signature');
            }
            
            // Process callback data
            return [
                'status' => $callbackData['resultCode'] === '00' ? 'success' : 'failed',
                'reference' => $reference,
                'amount' => $amount,
                'merchantCode' => $merchantCode,
                'data' => $callbackData
            ];
        } catch (\Exception $e) {
            Log::error('Duitku callback validation failed', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);
            
            throw $e;
        }
    }

    /**
     * Verify callback data from Duitku.
     *
     * @param  array  $callbackData
     * @return array
     */
    public function verifyCallback(array $callbackData): array
    {
        try {
            // Generate expected signature
            $merchantCode = $callbackData['merchantCode'] ?? '';
            $amount = $callbackData['amount'] ?? 0;
            $merchantOrderId = $callbackData['merchantOrderId'] ?? '';
            $signature = $callbackData['signature'] ?? '';
            
            $expectedSignature = md5($merchantCode . $amount . $merchantOrderId . $this->apiKey);
            
            // Verify signature
            if ($signature !== $expectedSignature) {
                throw new \Exception('Invalid callback signature');
            }
            
            // Return valid response
            return [
                'status' => $callbackData['resultCode'] === '00' ? 'success' : 'failed',
                'amount' => $amount,
                'reference_number' => $merchantOrderId,
                'gateway_response' => $callbackData,
            ];
        } catch (\Exception $e) {
            Log::error('Duitku callback verification failed', [
                'error' => $e->getMessage(),
                'data' => $callbackData
            ]);
            
            throw $e;
        }
    }

    /**
     * Generate signature for Duitku API.
     *
     * @param  string  $merchantOrderId
     * @param  int  $amount
     * @return string
     */
    protected function generateSignature(string $merchantOrderId, int $amount): string
    {
        return md5($this->merchantCode . $merchantOrderId . $amount . $this->apiKey);
    }

    /**
     * Map gateway status to standardized status.
     *
     * @param  string  $gatewayStatus
     * @return string
     */
    protected function mapGatewayStatus(string $gatewayStatus): string
    {
        $statusMap = [
            'SUCCESS' => 'paid',
            'PAID' => 'paid',
            'PENDING' => 'pending',
            'FAILED' => 'failed',
            'CANCELED' => 'cancelled',
            'EXPIRED' => 'expired',
        ];
        
        return $statusMap[$gatewayStatus] ?? 'pending';
    }
}
