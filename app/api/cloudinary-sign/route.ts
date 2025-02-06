import cloudinary from 'cloudinary';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_SECRET) {
    return Response.json({ message: 'Cloudinary secret is missing' }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_SECRET
  );

  return Response.json({ signature, timestamp });
};
