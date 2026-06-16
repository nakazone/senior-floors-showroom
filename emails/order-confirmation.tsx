interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  total: string;
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  total,
}: OrderConfirmationEmailProps) {
  return (
    <div>
      <h1>Thank you, {customerName}!</h1>
      <p>Your order #{orderId} has been confirmed.</p>
      <p>Total: {total}</p>
    </div>
  );
}
