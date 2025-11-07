
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="relative text-center bg-cover bg-center rounded-lg shadow-xl overflow-hidden" style={{ backgroundImage: "url('https://picsum.photos/seed/kitesurf-main/1200/600')" }}>
        <div className="absolute inset-0 bg-brand-dark bg-opacity-60"></div>
        <div className="relative px-4 py-20 sm:py-32">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                Poczuj <span className="text-brand-primary">wolność</span> z Kitesurfingiem
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-200">
                Jesteśmy szkółką kitesurfingową, która pozwala na rozwijanie się w tym niesamowitym sporcie. Dołącz do nas i przeżyj przygodę życia!
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Link to="/rezerwacje" className="inline-block bg-brand-primary text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-brand-accent transition-transform transform hover:scale-105 shadow-lg">
                    Zarezerwuj teraz
                </Link>
                <Link to="/cennik" className="inline-block bg-white text-brand-primary font-bold text-lg px-8 py-3 rounded-md hover:bg-brand-light transition-transform transform hover:scale-105 shadow-lg">
                    Zobacz Cennik
                </Link>
            </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-brand-secondary mb-8">Dlaczego my?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-light mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197m0 0A7.962 7.962 0 0112 4.354a7.962 7.962 0 013 3.199m0 0A5.995 5.995 0 0118 12.75a5.995 5.995 0 01-3 5.197m0 0A7.962 7.962 0 0012 21.646a7.962 7.962 0 00-3-3.199" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Doświadczeni Instruktorzy</h3>
            <p className="text-gray-600">Nasi certyfikowani instruktorzy zapewnią Ci bezpieczeństwo i szybkie postępy.</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-light mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 9.5l.263-1.313a1 1 0 01.98-.814h6.04a1 1 0 01.98.814l.263 1.313M9 16h6M12 16v5" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Najlepszy Sprzęt</h3>
            <p className="text-gray-600">Korzystamy z nowoczesnego i regularnie serwisowanego sprzętu wiodących marek.</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-light mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Idealne Lokalizacje</h3>
            <p className="text-gray-600">Uczymy na najlepszych spotach w Polsce, z idealnymi warunkami do nauki.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
