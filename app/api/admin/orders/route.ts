import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const GET = (async (req: any) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    // get the name of user
    .populate('user', 'name');

  return Response.json(orders);
}) as any;
