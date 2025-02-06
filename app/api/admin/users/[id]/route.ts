import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import { getServerSession } from 'next-auth';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(params.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    return Response.json(user);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, isAdmin } = await req.json();

    await dbConnect();
    const user = await UserModel.findById(params.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    user.name = name;
    user.email = email;
    user.isAdmin = Boolean(isAdmin);

    const updatedUser = await user.save();
    return Response.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(params.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isAdmin) {
      return Response.json({ message: 'Cannot delete an admin user' }, { status: 403 });
    }

    await user.deleteOne();
    return Response.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
