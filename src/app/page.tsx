"use client";

import { useState } from 'react';
import { AppHeader } from '@/components/docuquery/AppHeader';
import { PdfUpload } from '@/components/docuquery/PdfUpload';
import { DocumentChat } from '@/components/docuquery/DocumentChat';
import { Card, CardContent } from '@/components/ui/card';

export default function DocuQueryPage() {
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePdfUploaded = (name: string, dataUri: string) => {
    setPdfName(name);
    setPdfDataUri(dataUri);
    setUploadError(null); // Clear previous errors
  };

  const handlePdfError = (errorMessage: string) => {
    setUploadError(errorMessage);
    setPdfName(null);
    setPdfDataUri(null);
  };

  const handleClearPdf = () => {
    setPdfName(null);
    setPdfDataUri(null);
    setUploadError(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 md:p-8 font-body">
      <AppHeader />
      <Card className="w-full max-w-2xl shadow-xl mt-4 md:mt-8">
        <CardContent className="p-4 md:p-6">
          {!pdfDataUri ? (
            <>
              <PdfUpload onPdfUploaded={handlePdfUploaded} onPdfError={handlePdfError} />
              {uploadError && (
                <p className="mt-4 text-sm text-destructive text-center p-2 bg-destructive/10 rounded-md">
                  {uploadError}
                </p>
              )}
            </>
          ) : (
            <DocumentChat
              pdfName={pdfName!}
              pdfDataUri={pdfDataUri}
              onClearPdf={handleClearPdf}
            />
          )}
        </CardContent>
      </Card>
      <footer className="mt-8 md:mt-12 text-center text-muted-foreground text-xs md:text-sm">
        <p>&copy; {new Date().getFullYear()} DocuQuery. All rights reserved.</p>
      </footer>
    </div>
  );
}
