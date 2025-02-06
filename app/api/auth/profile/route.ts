import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const PUT = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { name, email, password } = await req.json();

  await dbConnect();
  
  try {
    const dbUser = await UserModel.findById(session.user._id);
    if (!dbUser) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    dbUser.name = name;
    dbUser.email = email;
    if (password) {
      dbUser.password = await bcrypt.hash(password, 5);
    }

    await dbUser.save();
    return Response.json({ message: 'User has been updated' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
