import React, { useState, useEffect } from 'react';

interface CountdownPopupProps {
  onClose: () => void;
}

const CountdownPopup: React.FC<CountdownPopupProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 opacity-100">
        <h2 className="text-2xl font-bold text-brand-secondary mb-4">Prośba o rezerwację wysłana!</h2>
        <p className="text-gray-600 mb-6">
          Administrator został powiadomiony. Prosimy czekać na akceptację.
          Decyzja zostanie podjęta w ciągu:
        </p>
        <div className="text-6xl font-mono font-bold text-brand-primary mb-6">
          <span>{minutes.toString().padStart(2, '0')}</span>:<span>{seconds.toString().padStart(2, '0')}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Otrzymasz powiadomienie e-mail oraz aktualizację statusu na swoim koncie.
          Możesz zamknąć to okno, proces rezerwacji będzie kontynuowany w tle.
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary transition-colors duration-300"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default CountdownPopup;