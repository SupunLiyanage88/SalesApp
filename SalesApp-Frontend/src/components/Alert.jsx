import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: 'bg-green-100 text-green-800 border-green-400',
    error: 'bg-red-100 text-red-800 border-red-400',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    info: 'bg-blue-100 text-blue-800 border-blue-400',
  };

  return (
    <div className={`p-4 mb-4 border-l-4 rounded ${types[type]}`}>
      <div className="flex justify-between items-center">
        <p className="font-semibold">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
