<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Throwable;
use App\Exceptions\PaymentException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
        
        // Handle PaymentException specially
        $this->renderable(function (PaymentException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'payment_id' => $e->getPaymentId(),
                    'status' => 'error',
                ], $e->getCode() ?: 400);
            }
            
            if (class_exists(Inertia::class)) {
                return Inertia::render('Error/Payment', [
                    'status' => $e->getCode() ?: 400,
                    'message' => $e->getMessage(),
                    'payment_id' => $e->getPaymentId(),
                ]);
            }
            
            return redirect()->route('payment.error')
                ->with('error', $e->getMessage())
                ->with('payment_id', $e->getPaymentId());
        });
        
        // Handle other API exceptions
        $this->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson() && !($e instanceof PaymentException)) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'status' => 'error',
                ], $this->isHttpException($e) ? $e->getStatusCode() : 500);
            }
        });
    }
}
