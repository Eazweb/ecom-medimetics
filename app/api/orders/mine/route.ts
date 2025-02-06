import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { user } = session;
  await dbConnect();

  const orders = await OrderModel.find({ user: user._id });
  return Response.json(orders);
};
