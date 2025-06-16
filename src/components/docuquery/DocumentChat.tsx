"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Brain, XCircle, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { queryDocument, type QueryDocumentInput, type QueryDocumentOutput } from '@/ai/flows/query-document';
import { cn } from '@/lib/utils';

interface DocumentChatProps {
  pdfName: string;
  pdfDataUri: string;
  onClearPdf: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai' | 'error';
  text: string;
  isLoading?: boolean;
}

function LoadingDots() {
  return (
    <div className="flex space-x-1 items-center">
      <span className="sr-only">Loading...</span>
      <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></div>
    </div>
  );
}


export function DocumentChat({ pdfName, pdfDataUri, onClearPdf }: DocumentChatProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  // Initial welcome message from AI
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        type: 'ai',
        text: `I'm ready to answer questions about "${pdfName}". What would you like to know?`,
      }
    ]);
  }, [pdfName]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isQuerying) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      text: question.trim(),
    };
    const aiLoadingMessage: Message = {
      id: crypto.randomUUID(),
      type: 'ai',
      text: '',
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, aiLoadingMessage]);
    setQuestion('');
    setIsQuerying(true);

    try {
      const input: QueryDocumentInput = {
        pdfDataUri: pdfDataUri,
        question: userMessage.text,
      };
      const result: QueryDocumentOutput = await queryDocument(input);
      const aiResponseMessage: Message = {
        id: aiLoadingMessage.id, // Replace loading message
        type: 'ai',
        text: result.answer,
      };
      setMessages((prev) => prev.map(msg => msg.id === aiLoadingMessage.id ? aiResponseMessage : msg));
    } catch (error) {
      console.error('Error querying document:', error);
      const errorMessage: Message = {
        id: aiLoadingMessage.id, // Replace loading message
        type: 'error',
        text: 'Sorry, I encountered an error trying to answer your question. Please try again or ask something else.',
      };
      setMessages((prev) => prev.map(msg => msg.id === aiLoadingMessage.id ? errorMessage : msg));
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh] md:max-h-[calc(80vh-100px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl truncate" title={pdfName}>{pdfName}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearPdf} className="text-muted-foreground hover:text-destructive">
          <XCircle className="h-4 w-4 mr-1" /> Change PDF
        </Button>
      </div>

      <ScrollArea className="flex-grow mb-4 pr-3" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-end space-x-2',
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.type !== 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={cn(
                    msg.type === 'ai' && 'bg-primary text-primary-foreground',
                    msg.type === 'error' && 'bg-destructive text-destructive-foreground'
                  )}>
                    {msg.type === 'ai' ? <Brain size={18} /> : <AlertTriangle size={18} />}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-3 py-2 text-sm break-words shadow-sm',
                  msg.type === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none',
                  msg.type === 'error' && 'bg-destructive/20 text-destructive border border-destructive/50',
                )}
              >
                {msg.isLoading ? <LoadingDots /> : msg.text}
              </div>
              {msg.type === 'user' && (
                <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-accent text-accent-foreground">
                    <User size={18} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 border-t pt-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any question about your PDF..."
          className="flex-grow resize-none focus-visible:ring-primary"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isQuerying) {
              handleSubmit(e as any); // Type assertion for simplicity
            }
          }}
          disabled={isQuerying}
          aria-label="Ask a question"
        />
        <Button type="submit" disabled={!question.trim() || isQuerying} className="bg-accent hover:bg-accent/90 text-accent-foreground" size="icon" aria-label="Send question">
          {isQuerying ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
}
