'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { formatId } from '@/lib/utils';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

export default function ItemList({
  itemType,
}: {
  itemType: 'users' | 'products';
}) {
  const {
    data: items,
    error,
    isLoading,
    mutate,
  } = useSWR<any[]>(`/api/admin/${itemType}`, fetcher);

  const { trigger: deleteItem } = useSWRMutation(
    `/api/admin/${itemType}`,
    async (url:any, { arg }: { arg: { itemId: string } }) => {
      const toastId = toast.loading(`Deleting ${itemType.slice(0, -1)}...`);
      const res = await fetch(`${url}/${arg.itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${itemType.slice(0, -1)} deleted successfully`, {
          id: toastId,
        });
        mutate(); // Refresh the data
      } else {
        toast.error(data.message, {
          id: toastId,
        });
      }
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;
  if (!items || items.length === 0) return <div>No {itemType} found</div>;

  const columns =
    itemType === 'users'
      ? ['id', 'name', 'email', 'admin', 'actions']
      : ['id', 'name', 'price', 'category', 'actions'];

  return (
    <div>
      <h1 className='py-4 text-2xl'>
        {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
      </h1>

      <div className='overflow-x-auto'>
        <table className='table table-zebra'>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item._id}>
                <td>{formatId(item._id)}</td>
                <td>{item.name}</td>
                {itemType === 'users' ? (
                  <>
                    <td>{item.email}</td>
                    <td>{item.isAdmin ? 'YES' : 'NO'}</td>
                  </>
                ) : (
                  <>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.category}</td>
                  </>
                )}
                <td>
                  <Link
                    href={`/admin/${itemType}/${item._id}`}
                    type='button'
                    className='btn btn-ghost btn-sm'
                  >
                    Edit
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => deleteItem({ itemId: item._id })}
                    type='button'
                    className='btn btn-ghost btn-sm'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
