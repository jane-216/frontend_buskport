import { apiGet, apiPost, apiDelete } from './client';
import type { PostDto } from '../types';

export function getPosts(category?: string): Promise<PostDto[]> {
  const q = category ? `?category=${category}` : '';
  return apiGet<PostDto[]>(`/posts${q}`);
}

export function getPost(id: number): Promise<PostDto> {
  return apiGet<PostDto>(`/posts/${id}`);
}

export function createPost(data: Omit<PostDto, 'postId' | 'createdAt' | 'updatedAt'>): Promise<void> {
  return apiPost('/posts/', data);
}

export function deletePost(id: number): Promise<void> {
  return apiDelete(`/posts/${id}`);
}
