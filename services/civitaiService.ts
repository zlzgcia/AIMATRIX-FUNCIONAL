
import type { CivitaiApiResponse } from '../types';

const API_BASE_URL = 'https://civitai.com/api/v1';

export async function searchModels(query: string, type: string = 'Checkpoint', limit: number = 24): Promise<CivitaiApiResponse['items']> {
  const params = new URLSearchParams({
    limit: String(limit),
    sort: 'Most Downloaded',
  });

  if (query) {
    params.set('query', query);
  }
  if (type) {
    params.set('types', type);
  }

  const url = `${API_BASE_URL}/models?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Civitai API Error: ${response.statusText}`);
    }
    const data: CivitaiApiResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error("Failed to fetch models from Civitai:", error);
    throw error;
  }
}
