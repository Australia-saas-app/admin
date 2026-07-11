import React from 'react';

interface TechnicalDetailLayoutProps {
  orderId: string;
}

export default function TechnicalDetailLayout({ orderId }: TechnicalDetailLayoutProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Technical Detail Layout</h1>
      <p>This is a placeholder for order ID: {orderId}</p>
    </div>
  );
}
