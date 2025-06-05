<?php

namespace App\Exceptions;

use Exception;

class PaymentException extends Exception
{
    /**
     * The ID of the payment related to this exception.
     *
     * @var int|null
     */
    protected $paymentId;

    /**
     * Create a new payment exception instance.
     *
     * @param string $message
     * @param int|null $paymentId
     * @param int $code
     * @param \Throwable|null $previous
     * @return void
     */
    public function __construct(string $message, ?int $paymentId = null, int $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->paymentId = $paymentId;
    }

    /**
     * Get the ID of the payment related to this exception.
     *
     * @return int|null
     */
    public function getPaymentId(): ?int
    {
        return $this->paymentId;
    }

    /**
     * Create a new payment gateway exception.
     *
     * @param string $message
     * @param int|null $paymentId
     * @return static
     */
    public static function gatewayError(string $message, ?int $paymentId = null): self
    {
        return new static("Payment gateway error: {$message}", $paymentId, 503);
    }

    /**
     * Create a new payment validation exception.
     *
     * @param string $message
     * @param int|null $paymentId
     * @return static
     */
    public static function validationError(string $message, ?int $paymentId = null): self
    {
        return new static("Payment validation error: {$message}", $paymentId, 422);
    }

    /**
     * Create a new payment cancelled exception.
     *
     * @param int|null $paymentId
     * @return static
     */
    public static function cancelled(?int $paymentId = null): self
    {
        return new static("Payment was cancelled by the user", $paymentId, 400);
    }

    /**
     * Create a new payment expired exception.
     *
     * @param int|null $paymentId
     * @return static
     */
    public static function expired(?int $paymentId = null): self
    {
        return new static("Payment has expired", $paymentId, 400);
    }

    /**
     * Create a new insufficient funds exception.
     *
     * @param int|null $paymentId
     * @return static
     */
    public static function insufficientFunds(?int $paymentId = null): self
    {
        return new static("Insufficient funds to complete this payment", $paymentId, 400);
    }

    /**
     * Create a new already processed exception.
     *
     * @param int|null $paymentId
     * @return static
     */
    public static function alreadyProcessed(?int $paymentId = null): self
    {
        return new static("This payment has already been processed", $paymentId, 400);
    }
}
