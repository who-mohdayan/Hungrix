import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

const icons = {
  success: <FiCheckCircle className="text-green-500" size={20} />,
  error: <FiXCircle className="text-red-500" size={20} />,
  info: <FiInfo className="text-orange-500" size={20} />,
};

const bg = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-orange-50 border-orange-200',
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        ${bg[type]} max-w-sm`}
    >
      {icons[type]}
      <span className="text-gray-800 text-sm flex-1">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="text-gray-400 hover:text-gray-600">
        <FiX size={16} />
      </button>
    </div>
  );
}
