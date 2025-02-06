'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ValidationRule, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { User } from '@/lib/models/UserModel';
import { formatId } from '@/lib/utils';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

export default function UserEditForm({ userId }: { userId: string }) {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR<User>(`/api/admin/users/${userId}`, fetcher);
  const router = useRouter();

  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }: { arg: Partial<User> }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user');
      return data;
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<User>();

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('isAdmin', user.isAdmin);
    }
  }, [user, setValue]);

  const formSubmit = async (formData: Partial<User>) => {
    try {
      await updateUser(formData);
      toast.success('User updated successfully');
      router.push('/admin/users');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update user',
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof User;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className='my-3 md:flex'>
      <label className='label md:w-1/5' htmlFor={id}>
        {name}
      </label>
      <div className='md:w-4/5'>
        <input
          type='text'
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className='input input-bordered w-full max-w-md'
        />
        {errors[id]?.message && (
          <div className='text-error'>{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className='py-4 text-2xl'>Edit User {formatId(userId)}</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name='Name' id='name' required />
          <FormInput
            name='Email'
            id='email'
            required
            pattern={{
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            }}
          />

          <div className='my-3 md:flex'>
            <label className='label md:w-1/5' htmlFor='isAdmin'>
              Admin
            </label>
            <div className='md:w-4/5'>
              <input
                id='isAdmin'
                type='checkbox'
                className='toggle'
                {...register('isAdmin')}
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isUpdating}
            className='btn btn-primary'
          >
            {isUpdating && <span className='loading loading-spinner'></span>}
            Update
          </button>
          <Link className='btn ml-4' href='/admin/users'>
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}
