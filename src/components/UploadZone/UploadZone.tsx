'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { UploadZoneProps } from '@/src/types/ui.types';

/**
 * UploadZone Component
 * 
 * Handles drag-and-drop and camera capture for punch card images.
 * Provides visual feedback and validates file types and sizes.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export default function UploadZone({
  onUpload,
  acceptedFormats,
  maxSizeMB,
}: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device on mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Handle file upload with validation
  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file type
      const validTypes = acceptedFormats.map(format => `image/${format.toLowerCase()}`);
      if (!validTypes.includes(file.type)) {
        throw new Error('This ancient artifact must be a PNG, JPEG, or WEBP image');
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error(`This tome is too massive for resurrection (max ${maxSizeMB}MB)`);
      }

      // Simulate upload progress with spooky animation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      await onUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset after successful upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The spirits are restless - upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, acceptedFormats, maxSizeMB]);

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
  });

  // Handle camera capture for mobile
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-toxic-green bg-toxic-green/10 scale-105 shadow-lg shadow-toxic-green/50' 
            : 'border-dark-green hover:border-toxic-green/70 hover:bg-dark-green/20'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Upload icon with spooky animation */}
        <div className="mb-6">
          <svg
            className={`w-20 h-20 mx-auto text-toxic-green transition-transform duration-300 ${
              isDragActive ? 'scale-125 animate-pulse' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Upload text */}
        <div className="font-mono text-toxic-green">
          {isUploading ? (
            <div className="space-y-4">
              <p className="text-lg animate-pulse">Summoning the spirits...</p>
              <div className="w-full bg-dark-green rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-toxic-green transition-all duration-300 ease-out relative"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              <p className="text-sm opacity-70">{uploadProgress}% resurrected</p>
            </div>
          ) : isDragActive ? (
            <p className="text-xl font-bold animate-pulse">Release the ancient artifact...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg">Drag & drop your punch card photo here</p>
              <p className="text-sm opacity-70">or click to select from the crypt</p>
              <p className="text-xs opacity-50 mt-4">
                Accepted formats: PNG, JPEG, WEBP (max {maxSizeMB}MB)
              </p>
            </div>
          )}
        </div>

        {/* Glowing corners effect when dragging */}
        {isDragActive && (
          <>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-toxic-green animate-pulse" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-toxic-green animate-pulse" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-toxic-green animate-pulse" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-toxic-green animate-pulse" />
          </>
        )}
      </div>

      {/* Mobile camera capture button */}
      {isMobile && !isUploading && (
        <div className="mt-6">
          <label
            htmlFor="camera-capture"
            className="block w-full py-4 px-6 text-center font-mono text-toxic-green border-2 border-toxic-green rounded-lg cursor-pointer hover:bg-toxic-green/10 transition-colors duration-300 min-h-touch active:bg-toxic-green/20"
            style={{ minHeight: '44px' }}
          >
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Capture with Camera
          </label>
          <input
            id="camera-capture"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 border-2 border-red-600 bg-red-900/20 rounded-lg animate-shake">
          <div className="flex items-center space-x-3">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-mono text-red-400 text-sm md:text-base">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-3 px-4 py-2 text-sm font-mono text-toxic-green border border-toxic-green rounded hover:bg-toxic-green/10 transition-colors duration-300 active:bg-toxic-green/20 min-h-touch"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
