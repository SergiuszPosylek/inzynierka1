
import React from 'react';
import { LOCATIONS } from '../constants';
import type { Location } from '../types';

const LocationCard: React.FC<{ location: Location }> = ({ location }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img src={location.imageUrl} alt={location.name} className="w-full h-56 object-cover" />
        <div className="p-6">
            <h3 className="text-2xl font-bold text-brand-secondary mb-3">{location.name}</h3>
            <div className="space-y-2 text-gray-700">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href={`mailto:${location.email}`} className="hover:text-brand-primary">{location.email}</a>
                </div>
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="hover:text-brand-primary">{location.phone}</a>
                </div>
            </div>
        </div>
    </div>
);

const ContactPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-brand-secondary mb-10">Nasze Lokalizacje</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {LOCATIONS.map(location => (
                    <LocationCard key={location.id} location={location} />
                ))}
            </div>
        </div>
    );
};

export default ContactPage;
