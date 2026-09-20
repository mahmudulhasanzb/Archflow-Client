'use server';

import { revalidatePath } from 'next/cache';
import { serverMutation } from '../mutation';

export const toggleUserBlockAction = async (userId: string, isBlocked: boolean) => {
  try {
    const res = await serverMutation(`/api/admin/users/${userId}/block`, 'PATCH', { isBlocked });
    revalidatePath('/admin/users');
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user block status' };
  }
};

export const updateUserRoleAction = async (userId: string, role: 'free' | 'pro') => {
  try {
    const res = await serverMutation(`/api/admin/users/${userId}/role`, 'PATCH', { role });
    revalidatePath('/admin/users');
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user role' };
  }
};
