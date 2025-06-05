<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle Midtrans payment webhook
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function midtrans(Request $request)
    {
        // Validate the webhook request
        $payload = $request->all();
        Log::info('Midtrans payment webhook received', $payload);
        
        // In a real application, verify the webhook signature here
        
        // Process the payment update
        if (isset($payload['transaction_id'])) {
            $payment = Payment::where('transaction_id', $payload['transaction_id'])->first();
            
            if ($payment) {
                $payment->status = $this->mapMidtransStatus($payload['transaction_status'] ?? '');
                $payment->payment_method = 'midtrans';
                $payment->paid_at = $payment->status === 'paid' ? now() : null;
                $payment->save();
                
                Log::info('Payment updated via Midtrans', ['payment_id' => $payment->id, 'status' => $payment->status]);
                
                return response()->json(['success' => true]);
            }
        }
        
        return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
    }

    /**
     * Handle Xendit payment webhook
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function xendit(Request $request)
    {
        // Validate the webhook request
        $payload = $request->all();
        Log::info('Xendit payment webhook received', $payload);
        
        // In a real application, verify the webhook signature here using Xendit's callback token
        
        // Process the payment update
        if (isset($payload['external_id'])) {
            $payment = Payment::where('transaction_id', $payload['external_id'])->first();
            
            if ($payment) {
                $payment->status = $this->mapXenditStatus($payload['status'] ?? '');
                $payment->payment_method = 'xendit';
                $payment->paid_at = $payment->status === 'paid' ? now() : null;
                $payment->save();
                
                Log::info('Payment updated via Xendit', ['payment_id' => $payment->id, 'status' => $payment->status]);
                
                return response()->json(['success' => true]);
            }
        }
        
        return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
    }

    /**
     * Handle GoPay payment webhook
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function gopay(Request $request)
    {
        // Validate the webhook request
        $payload = $request->all();
        Log::info('GoPay payment webhook received', $payload);
        
        // In a real application, verify the webhook signature here
        
        // Process the payment update
        if (isset($payload['order_id'])) {
            $payment = Payment::where('transaction_id', $payload['order_id'])->first();
            
            if ($payment) {
                $payment->status = $this->mapGopayStatus($payload['transaction_status'] ?? '');
                $payment->payment_method = 'gopay';
                $payment->paid_at = $payment->status === 'paid' ? now() : null;
                $payment->save();
                
                Log::info('Payment updated via GoPay', ['payment_id' => $payment->id, 'status' => $payment->status]);
                
                return response()->json(['success' => true]);
            }
        }
        
        return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
    }

    /**
     * Map Midtrans status to our internal payment status
     *
     * @param  string  $status
     * @return string
     */
    private function mapMidtransStatus($status)
    {
        switch ($status) {
            case 'settlement':
            case 'capture':
                return 'paid';
            case 'pending':
                return 'pending';
            case 'deny':
            case 'cancel':
            case 'expire':
            case 'failure':
                return 'failed';
            default:
                return 'pending';
        }
    }

    /**
     * Map Xendit status to our internal payment status
     *
     * @param  string  $status
     * @return string
     */
    private function mapXenditStatus($status)
    {
        switch ($status) {
            case 'PAID':
            case 'COMPLETED':
                return 'paid';
            case 'PENDING':
                return 'pending';
            case 'EXPIRED':
            case 'FAILED':
                return 'failed';
            default:
                return 'pending';
        }
    }

    /**
     * Map GoPay status to our internal payment status
     *
     * @param  string  $status
     * @return string
     */
    private function mapGopayStatus($status)
    {
        switch ($status) {
            case 'settlement':
                return 'paid';
            case 'pending':
                return 'pending';
            case 'deny':
            case 'cancel':
            case 'expire':
                return 'failed';
            default:
                return 'pending';
        }
    }
}
