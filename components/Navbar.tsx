
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavLinkItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-brand-primary text-white'
          : 'text-gray-300 hover:bg-brand-accent hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/', text: 'O nas' },
    { to: '/rezerwacje', text: 'Rezerwacje' },
    { to: '/cennik', text: 'Cennik' },
    { to: '/kontakt', text: 'Kontakt' },
  ];

  return (
    <nav className="bg-brand-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
               <NavLink to="/" className="text-white text-xl font-bold">Kite<span className="text-brand-primary">School</span></NavLink>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map(link => <NavLinkItem key={link.to} to={link.to}>{link.text}</NavLinkItem>)}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <>
                  {user.role === 'ADMIN' && <NavLinkItem to="/admin">Admin</NavLinkItem>}
                  <NavLinkItem to="/konto">Konto</NavLinkItem>
                  <button
                    onClick={logout}
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-brand-accent hover:text-white"
                  >
                    Wyloguj
                  </button>
                </>
              ) : (
                <NavLinkItem to="/auth">Logowanie / Rejestracja</NavLinkItem>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-brand-accent inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map(link => <NavLinkItem key={link.to} to={link.to}>{link.text}</NavLinkItem>)}
             <div className="border-t border-gray-700 pt-4 mt-4">
                {user ? (
                  <>
                    {user.role === 'ADMIN' && <NavLinkItem to="/admin">Admin</NavLinkItem>}
                    <NavLinkItem to="/konto">Konto</NavLinkItem>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full text-left mt-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-brand-accent hover:text-white"
                    >
                      Wyloguj
                    </button>
                  </>
                ) : (
                  <NavLinkItem to="/auth">Logowanie / Rejestracja</NavLinkItem>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
