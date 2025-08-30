'use server';

import { revalidatePath as nextRevalidatePath } from 'next/cache';

export async function revalidatePath(path: string) {
  try {
    nextRevalidatePath(path, 'layout');
    console.log(`Revalidated: ${path}`);
  } catch (error) {
    console.error(`Error revalidating ${path}:`, error);
  }
}
