
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking, BookingStatus, Role } from '../types';

const getStatusClass = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.ACCEPTED: return 'bg-green-100 text-green-800';
        case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case BookingStatus.REJECTED: return 'bg-red-100 text-red-800';
        case BookingStatus.CANCELLED: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const BookingRequest: React.FC<{ booking: Booking; onUpdate: () => void }> = ({ booking, onUpdate }) => {
    const [timeLeft, setTimeLeft] = useState(180);
    const { user } = useAuth();
    
    useEffect(() => {
        const createdAt = new Date(booking.createdAt).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - createdAt) / 1000);
        const remaining = 180 - diff;
        setTimeLeft(remaining > 0 ? remaining : 0);

        if (remaining > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [booking.createdAt]);

    const handleUpdate = async (status: BookingStatus.ACCEPTED | BookingStatus.REJECTED) => {
        let reason = '';
        if (status === BookingStatus.REJECTED) {
            reason = prompt("Podaj powód odrzucenia (opcjonalnie):") || 'Brak dostępności';
        }

        try {
            await api.updateBookingStatus(booking.id, status, user?.role, reason);
            onUpdate();
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className={`p-4 rounded-lg shadow-md transition-all duration-300 ${timeLeft > 0 ? 'bg-white' : 'bg-gray-100 opacity-70'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-brand-dark">{booking.userEmail}</p>
                    <p className="text-sm text-gray-600">{booking.type}</p>
                    <p className="text-sm text-gray-600">{new Date(booking.date).toLocaleDateString('pl-PL')} o {booking.time}</p>
                </div>
                <div className={`text-xl font-mono font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-brand-primary'}`}>
                    {timeLeft > 0 ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : 'Czas upłynął'}
                </div>
            </div>
            {timeLeft > 0 && (
                <div className="mt-4 flex gap-4">
                    <button onClick={() => handleUpdate(BookingStatus.ACCEPTED)} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Zaakceptuj</button>
                    <button onClick={() => handleUpdate(BookingStatus.REJECTED)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Odrzuć</button>
                </div>
            )}
        </div>
    );
};

const AdminPage: React.FC = () => {
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    
    const fetchAllBookings = useCallback(async () => {
        if (user?.role !== Role.ADMIN) return;
        setLoading(true);
        try {
            const bookings = await api.getAllBookings();
            setAllBookings(bookings);
            setPendingBookings(bookings.filter(b => b.status === BookingStatus.PENDING));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAllBookings();
        const interval = setInterval(fetchAllBookings, 5000); // Poll for new bookings
        return () => clearInterval(interval);
    }, [fetchAllBookings]);

    if(loading && allBookings.length === 0) return <p>Ładowanie panelu administratora...</p>
    if(error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-brand-secondary">Panel Administratora</h1>
            
            <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4">Nowe prośby o rezerwację</h2>
                {pendingBookings.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingBookings
                          .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                          .map(booking => (
                            <BookingRequest key={booking.id} booking={booking} onUpdate={fetchAllBookings} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 bg-white p-4 rounded-md shadow-sm">Brak nowych próśb.</p>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4">Wszystkie rezerwacje</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Użytkownik</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allBookings
                                  .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.userEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.date).toLocaleDateString('pl-PL')} {booking.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminPage;
