// app/api/admin/summary/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import UserModel from '@/lib/models/UserModel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const ordersCount = await OrderModel.countDocuments();
    const productsCount = await ProductModel.countDocuments();
    const usersCount = await UserModel.countDocuments();

    const ordersPriceGroup = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);

    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    const salesData = await OrderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const productsData = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const usersData = await UserModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

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
      { status: 500 }
    );
  }
}