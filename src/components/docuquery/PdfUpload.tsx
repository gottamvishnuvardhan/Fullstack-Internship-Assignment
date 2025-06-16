"use client";

import type { ChangeEvent, DragEvent } from 'react';
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Loader2, FileText } from 'lucide-react';

interface PdfUploadProps {
  onPdfUploaded: (name: string, dataUri: string) => void;
  onPdfError: (message: string) => void;
}

export function PdfUpload({ onPdfUploaded, onPdfError }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileProcessing = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      onPdfError('Invalid file type. Please upload a PDF.');
      return;
    }
    // Basic size check (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
        onPdfError('File is too large. Maximum size is 10MB.');
        return;
    }

    setIsLoading(true);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onPdfUploaded(file.name, e.target.result);
      } else {
        onPdfError('Failed to read the PDF file.');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      onPdfError('Error reading the PDF file.');
      setIsLoading(false);
      setFileName(null);
    };
    reader.readAsDataURL(file);
  }, [onPdfUploaded, onPdfError]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileProcessing(event.target.files[0]);
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true); // Ensure it's set if missed by enter
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileProcessing(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CardTitle className="font-headline text-2xl">Upload your Document</CardTitle>
        <CardDescription className="font-body">
          Drag & drop a PDF file or click to select. Max 10MB.
        </CardDescription>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors
          ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
          ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
        onClick={() => !isLoading && document.getElementById('pdf-upload-input')?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') !isLoading && document.getElementById('pdf-upload-input')?.click()}}
        aria-label="PDF upload area"
      >
        <Input
          id="pdf-upload-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
            <p className="text-primary font-medium">Processing: {fileName || 'your PDF'}</p>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </>
        ) : fileName ? (
           <>
            <FileText className="h-12 w-12 text-green-500 mb-3" />
            <p className="text-foreground font-medium">{fileName}</p>
            <p className="text-sm text-muted-foreground">Ready to upload. Click to change.</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-12 w-12 text-primary mb-3" />
            <p className="text-primary font-medium">Drag & drop PDF here</p>
            <p className="text-sm text-muted-foreground">or click to select a file</p>
          </>
        )}
      </div>
      {!isLoading && (
        <Button
            onClick={() => document.getElementById('pdf-upload-input')?.click()}
            className="w-full font-medium"
            variant="outline"
            aria-label="Select PDF file"
        >
            Select PDF File
        </Button>
      )}
    </div>
  );
}
