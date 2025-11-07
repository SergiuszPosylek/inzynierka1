
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} KiteSurfing School. Wszelkie prawa zastrzeżone.</p>
        <p className="text-sm text-gray-400 mt-1">Stworzone z pasją do fal</p>
      </div>
    </footer>
  );
};

export default Footer;
