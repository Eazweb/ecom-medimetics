import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import UserModel from '@/lib/models/UserModel';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures this route is always treated as dynamic

export async function GET(req: NextRequest) {
  try {
    // Check for admin session
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Perform database queries
    const [
      ordersCount,
      productsCount,
      usersCount,
      ordersPriceGroup,
      salesData,
      productsData,
      usersData,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      ProductModel.countDocuments(),
      UserModel.countDocuments(),
      OrderModel.aggregate([
        { $group: { _id: null, sales: { $sum: '$totalPrice' } } },
      ]),
      OrderModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            totalOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      ProductModel.aggregate([
        {
          $group: {
            _id: '$category',
            totalProducts: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      UserModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            totalUsers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Extract total sales
    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    // Return the summary response
    return NextResponse.json({
      ordersCount,
      productsCount,
      usersCount,
      ordersPrice,
      salesData,
      productsData,
      usersData,
    });
  } catch (error) {
    console.error('Summary API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
