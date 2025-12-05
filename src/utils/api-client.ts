/**
 * API client utilities for PunchRevive
 */

interface UploadResponse {
  success: boolean;
  jobId?: string;
  message: string;
  error?: string;
}

interface ProcessingResponse {
  status: 'processing' | 'complete' | 'error';
  progress: number;
  result?: any;
  error?: string;
}

/**
 * Submit a virtual punch card pattern for processing
 */
export async function submitVirtualCard(pattern: boolean[][]): Promise<UploadResponse> {
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pattern,
      source: 'virtual',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit virtual card');
  }

  return response.json();
}

/**
 * Upload a punch card image file
 */
export async function uploadPunchCardImage(
  file: File,
  source: 'upload' | 'camera' = 'upload'
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('source', source);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }

  return response.json();
}

/**
 * Poll processing status for a job
 */
export async function getProcessingStatus(jobId: string): Promise<ProcessingResponse> {
  // Try results endpoint first (for local mode)
  let response = await fetch(`/api/results/${jobId}`);
  
  // Fallback to process endpoint (for AI mode)
  if (!response.ok && response.status === 404) {
    response = await fetch(`/api/process/${jobId}`);
  }

  if (!response.ok) {
    throw new Error('Failed to get processing status');
  }

  return response.json();
}

/**
 * Poll processing status until complete or error
 */
export async function waitForProcessing(
  jobId: string,
  onProgress?: (progress: number) => void
): Promise<ProcessingResponse> {
  const pollInterval = 1000; // 1 second
  const maxAttempts = 60; // 60 seconds max
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getProcessingStatus(jobId);

    if (onProgress) {
      onProgress(status.progress);
    }

    if (status.status === 'complete' || status.status === 'error') {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
    attempts++;
  }

  throw new Error('Processing timeout - the resurrection ritual is taking too long');
}
