
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { getServerSession } from 'next-auth';

export const PUT = (async (...args: any) => {
  const [req, { params }] = args;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    await dbConnect();

    const order = await OrderModel.findById(params.id);
    if (order) {
      // order must be paid to mark as delivered
      if (!order.isPaid)
        return Response.json(
          { message: 'Order is not paid' },
          {
            status: 400,
          },
        );
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      return Response.json(updatedOrder);
    } else {
      return Response.json(
        { message: 'Order not found' },
        {
          status: 404,
        },
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      },
    );
  }
}) as any;
