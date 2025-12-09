/**
 * Neon JS Full Client Configuration
 *
 * This template shows how to set up the unified Neon JS client
 * with both authentication and database query capabilities.
 *
 * Files to create:
 * 1. lib/auth/client.ts - Auth client for client components
 * 2. lib/db/client.ts - Database client for queries
 */

// =============================================================================
// FILE 1: lib/auth/client.ts
// =============================================================================

// import { createAuthClient } from "@neondatabase/neon-js/auth/next";
//
// /**
//  * Auth client for use in client components.
//  * Automatically uses NEXT_PUBLIC_NEON_AUTH_URL.
//  */
// export const authClient = createAuthClient();

// =============================================================================
// FILE 2: lib/db/client.ts
// =============================================================================

import { createClient } from '@neondatabase/neon-js';

// Import generated types if available
// import type { Database } from "./database.types";

/**
 * Database client for PostgREST-style queries.
 *
 * Usage:
 *   import { dbClient } from "@/lib/db/client";
 *
 *   // Select
 *   const { data } = await dbClient.from("posts").select();
 *
 *   // Insert
 *   const { data } = await dbClient.from("posts").insert({ title: "New" }).select().single();
 *
 *   // Update
 *   await dbClient.from("posts").update({ title: "Updated" }).eq("id", 1);
 *
 *   // Delete
 *   await dbClient.from("posts").delete().eq("id", 1);
 */
export const dbClient = createClient({
  auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});

// =============================================================================
// EXAMPLE USAGE
// =============================================================================

/**
 * Example: Fetch posts with author information
 */
async function getPostsWithAuthors() {
  const { data, error } = await dbClient
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      created_at,
      author:users (
        id,
        name,
        email
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching posts:', error.message);
    return [];
  }

  return data;
}

/**
 * Example: Create a new post
 */
async function createPost(authorId: string, title: string, content: string) {
  const { data, error } = await dbClient
    .from('posts')
    .insert({
      author_id: authorId,
      title,
      content,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  return data;
}

/**
 * Example: Update a post
 */
async function updatePost(
  postId: number,
  updates: { title?: string; content?: string }
) {
  const { data, error } = await dbClient
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }

  return data;
}

/**
 * Example: Delete a post
 */
async function deletePost(postId: number) {
  const { error } = await dbClient.from('posts').delete().eq('id', postId);

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }

  return true;
}

/**
 * Example: Filter and paginate
 */
async function searchPosts(
  query: string,
  page: number = 1,
  pageSize: number = 10
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await dbClient
    .from('posts')
    .select('*', { count: 'exact' })
    .ilike('title', `%${query}%`)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  return {
    posts: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
