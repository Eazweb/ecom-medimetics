import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { paypal } from '@/lib/paypal';

export const POST = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
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
    const paypalOrder = await paypal.createOrder(order.totalPrice);
    return Response.json(paypalOrder);
  } catch (err: any) {
    return Response.json(
      { message: err.message || 'Failed to create PayPal order' },
      { status: 500 },
    );
  }
};
