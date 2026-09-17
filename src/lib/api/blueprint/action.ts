'use server';

import { revalidatePath } from 'next/cache';
import { serverMutation, deleteMutation } from '../mutation';

export const createBlueprintAction = async (data: any) => {
  const res = await serverMutation('/api/blueprints', 'POST', data);
  revalidatePath('/workspace');
  revalidatePath('/blueprints');
  revalidatePath('/manage-blueprints');
  return res;
};

export const updateBlueprintAction = async (id: string, data: any) => {
  const res = await serverMutation(`/api/blueprints/${id}`, 'PATCH', data);
  revalidatePath('/workspace');
  revalidatePath('/blueprints');
  revalidatePath(`/blueprints/${id}`);
  revalidatePath('/manage-blueprints');
  return res;
};

export const deleteBlueprintAction = async (id: string) => {
  const res = await deleteMutation(`/api/my-blueprints/${id}`);
  revalidatePath('/workspace');
  revalidatePath('/blueprints');
  revalidatePath('/manage-blueprints');
  return res;
};

export const rateBlueprintAction = async (id: string, rating: number) => {
  const res = await serverMutation(`/api/blueprints/${id}/rate`, 'POST', { rating });
  revalidatePath(`/blueprints/${id}`);
  revalidatePath('/blueprints');
  return res;
};

export const incrementViewAction = async (id: string) => {
  try {
    return await serverMutation(`/api/blueprints/${id}/view`, 'POST', {});
  } catch {
    // Non-blocking telemetry
    return null;
  }
};

export const incrementDownloadAction = async (id: string) => {
  try {
    const res = await serverMutation(`/api/blueprints/${id}/download`, 'POST', {});
    revalidatePath('/blueprints');
    return res;
  } catch {
    // Non-blocking telemetry
    return null;
  }
};
