import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Searching for books..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground text-center">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

