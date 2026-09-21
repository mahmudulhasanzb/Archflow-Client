'use server';

import { revalidatePath } from 'next/cache';
import { serverMutation, deleteMutation } from '../mutation';

export const toggleUserBlockAction = async (userId: string, isBlocked: boolean) => {
  try {
    const res = await serverMutation(`/api/admin/users/${userId}/block`, 'PATCH', { isBlocked });
    revalidatePath('/workspace/admin/users');
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user block status' };
  }
};

export const updateUserRoleAction = async (
  userId: string,
  role: 'admin' | 'user' | 'free' | 'pro'
) => {
  try {
    const res = await serverMutation(`/api/admin/users/${userId}/role`, 'PATCH', { role });
    revalidatePath('/workspace/admin/users');
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user role' };
  }
};

export const toggleAdminBlueprintVisibilityAction = async (
  blueprintId: string,
  visibility: 'public' | 'private'
) => {
  try {
    const res = await serverMutation(`/api/admin/blueprints/${blueprintId}/visibility`, 'PATCH', {
      visibility,
    });
    revalidatePath('/workspace/manage-blueprints');
    revalidatePath('/blueprints');
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update blueprint visibility' };
  }
};

export const deleteAdminBlueprintAction = async (blueprintId: string) => {
  try {
    const res = await deleteMutation(`/api/admin/blueprints/${blueprintId}`);
    revalidatePath('/workspace/manage-blueprints');
    revalidatePath('/blueprints');
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete blueprint' };
  }
};


