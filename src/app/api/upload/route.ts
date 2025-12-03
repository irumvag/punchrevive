import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

interface UploadResponse {
  success: boolean;
  jobId?: string;
  message: string;
  error?: string;
}

/**
 * POST /api/upload
 * Handles punch card image upload and initiates processing
 * Supports both image files and virtual punch card patterns
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Handle virtual punch card (JSON payload)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { pattern, source } = body;
      
      if (!pattern || !Array.isArray(pattern)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid punch pattern provided',
            error: 'INVALID_PATTERN'
          },
          { status: 400 }
        );
      }
      
      // Validate pattern dimensions (12 rows × 80 columns)
      if (pattern.length !== 12 || !pattern.every((row: any) => Array.isArray(row) && row.length === 80)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Punch pattern must be 12 rows × 80 columns',
            error: 'INVALID_DIMENSIONS'
          },
          { status: 400 }
        );
      }
      
      // Generate unique job ID
      const jobId = randomUUID();
      
      // Store virtual pattern
      const uploadDir = join(tmpdir(), 'punchrevive-uploads');
      await mkdir(uploadDir, { recursive: true });
      
      const patternPath = join(uploadDir, `${jobId}.json`);
      await writeFile(patternPath, JSON.stringify({ pattern, source: source || 'virtual' }));
      
      return NextResponse.json(
        {
          success: true,
          jobId,
          message: '⚡ Virtual card resurrection initiated...'
        },
        { status: 200 }
      );
    }
    
    // Handle image file upload
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const source = formData.get('source') as string || 'upload';

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: 'This ancient artifact must be a PNG, JPEG, or WEBP image',
          error: 'NO_FILE'
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'This ancient artifact must be a PNG, JPEG, or WEBP image',
          error: 'INVALID_FORMAT'
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: 'This tome is too massive for resurrection (max 10MB)',
          error: 'FILE_TOO_LARGE'
        },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = randomUUID();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store image temporarily
    const uploadDir = join(tmpdir(), 'punchrevive-uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, `${jobId}.${file.type.split('/')[1]}`);
    await writeFile(filePath, buffer);

    // TODO: Trigger async processing pipeline (OCR -> Decode -> Translate)
    // This will be implemented when we integrate the services

    return NextResponse.json(
      {
        success: true,
        jobId,
        message: '⚡ Resurrection sequence initiated...'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'The spirits are restless - connection lost',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
