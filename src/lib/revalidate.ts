'use server';
import { revalidatePath as nextRevalidatePath } from 'next/cache';

/**
 * Revalidates a given path on the site to ensure fresh content is served.
 * This is used for on-demand revalidation, typically after a data mutation.
 * @param path The path to revalidate (e.g., '/', '/jobs', '/competitions/[id]').
 */
export async function revalidatePath(path: string) {
  try {
    // Using 'layout' ensures all nested paths under the given path are revalidated.
    nextRevalidatePath(path, 'layout');
    console.log(`Successfully revalidated path: ${path}`);
  } catch (error) {
    console.error(`Error revalidating path ${path}:`, error);
  }
}
