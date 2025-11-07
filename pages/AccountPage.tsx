
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking, BookingStatus } from '../types';

const getStatusClass = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.ACCEPTED: return 'bg-green-100 text-green-800';
        case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case BookingStatus.REJECTED: return 'bg-red-100 text-red-800';
        case BookingStatus.CANCELLED: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const AccountPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const userBookings = await api.getUserBookings(user.id);
                setBookings(userBookings);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancel = async (bookingId: string) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const hoursBefore = (booking.date.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        let confirmMessage = "Czy na pewno chcesz anulować rezerwację?";
        if (hoursBefore < 24) {
            confirmMessage += "\n\nUwaga: Anulowanie mniej niż 24 godziny przed terminem wiąże się z opłatą w wysokości 50% ceny.";
        }
        
        if (window.confirm(confirmMessage)) {
            try {
                await api.updateBookingStatus(bookingId, BookingStatus.CANCELLED, user?.role);
                fetchBookings(); // Refresh bookings
            } catch (err: any) {
                alert(`Błąd podczas anulowania: ${err.message}`);
            }
        }
    };

    if (loading) return <p>Ładowanie historii rezerwacji...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-secondary mb-6">Witaj, {user?.email}!</h1>
            <h2 className="text-2xl font-semibold text-brand-dark mb-4">Historia Twoich rezerwacji</h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Godzina</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ Usługi</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.length > 0 ? bookings.map(booking => {
                                const canCancel = booking.status === BookingStatus.ACCEPTED || booking.status === BookingStatus.PENDING;
                                return (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.date).toLocaleDateString('pl-PL')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {canCancel ? (
                                            <button onClick={() => handleCancel(booking.id)} className="text-red-600 hover:text-red-900">Anuluj</button>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Brak rezerwacji.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
