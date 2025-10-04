import { FC, ReactNode, useState } from 'react';

interface FilterContainerProps {
  children: ReactNode;
  onReset: () => void;
  onApply?: () => void;
  title?: string;
  description?: string;
}

export const FilterContainer: FC<FilterContainerProps> = ({
  children,
  onReset,
  onApply,
  title = 'Filtros',
  description = 'Use os filtros abaixo para refinar sua busca',
}) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      if (onApply) {
        await onApply();
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="space-y-6">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-200 ${isApplying ? 'opacity-50' : 'opacity-100'}`}
        >
          {children}
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={onReset}
            disabled={isApplying}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Limpar Filtros
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="inline-flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Aplicando...
              </>
            ) : (
              'Aplicar Filtros'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
