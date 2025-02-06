import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const GET = async (
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

  return Response.json(order);
};
