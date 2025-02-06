import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const users = await UserModel.find().lean();
    return Response.json(users);
  } catch (error: any) {
    return Response.json(
      { message: 'Error fetching users', error: error.message },
      { status: 500 },
    );
  }
}
