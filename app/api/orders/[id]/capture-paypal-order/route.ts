import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { paypal } from '@/lib/paypal';

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const order = await OrderModel.findById(params.id);
  
  if (!order) {
    return Response.json({ message: 'Order not found' }, { status: 404 });
  }

  try {
    const { orderID } = await req.json();
    if (!orderID) {
      return Response.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const captureData = await paypal.capturePayment(orderID);
    
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
    };

    const updatedOrder = await order.save();
    return Response.json(updatedOrder);
  } catch (err: any) {
    return Response.json({ message: err.message || 'Payment processing failed' }, { status: 500 });
  }
};
