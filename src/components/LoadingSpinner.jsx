import { Loader } from 'lucide-react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader className="w-12 h-12 text-primary animate-spin" />
      <p className="text-textSecondary text-sm">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
