import { RefreshCw } from 'lucide-react';
import React from 'react';

interface RefreshProps {
  onRefresh: () => void;
  loading: boolean;
}

const Refresh = ({ onRefresh, loading }: RefreshProps) => {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-lg border border-[#E1E4EA] bg-white px-4 py-2 text-xs font-semibold text-[#181B20] hover:bg-[#F1F3F6] active:bg-[#E1E4EA] transition-colors disabled:opacity-50"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
      Refresh Listing
    </button>
  );
};

export default Refresh;
