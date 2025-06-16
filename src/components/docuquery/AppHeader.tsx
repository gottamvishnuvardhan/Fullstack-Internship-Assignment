import { BrainCircuit } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="w-full max-w-2xl text-center">
      <div className="flex items-center justify-center mb-2">
        {/* Using a generic icon, replace with a custom logo if available */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-primary h-10 w-10 md:h-12 md:w-12"
          aria-label="DocuQuery Logo"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <circle cx="10.5" cy="15.5" r="2.5"></circle>
          <path d="M10.5 13V9"></path>
          <path d="m13.5 18.5 3-3"></path>
        </svg>
        <h1 className="ml-3 text-3xl md:text-4xl font-headline font-bold text-primary">
          DocuQuery
        </h1>
      </div>
      <p className="text-muted-foreground font-body text-sm md:text-base">
        Upload your PDF and ask questions to get insights instantly.
      </p>
    </header>
  );
}
