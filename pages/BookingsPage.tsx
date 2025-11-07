
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingType, BookingStatus } from '../types';
import { AVAILABLE_HOURS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import CountdownPopup from '../components/CountdownPopup';

const BookingTypeSelector: React.FC<{ selected: BookingType; onSelect: (type: BookingType) => void }> = ({ selected, onSelect }) => {
  const types = Object.values(BookingType);
  return (
    <div className="flex justify-center flex-wrap gap-4 mb-8">
      {types.map(type => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform shadow-md ${
            selected === type
              ? 'bg-brand-primary text-white scale-105'
              : 'bg-white text-brand-secondary hover:bg-brand-light'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

const Calendar: React.FC<{ selectedDate: Date; onDateChange: (date: Date) => void }> = ({ selectedDate, onDateChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const minBookingDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        date.setHours(0, 0, 0, 0);
        return date;
    }, []);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const changeMonth = (delta: number) => {
        let newMonth = currentMonth + delta;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth, currentYear);
        const startDay = (firstDayOfMonth(currentMonth, currentYear) + 6) % 7;

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 border border-transparent"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isDisabled = date < minBookingDate;

            days.push(
                <button
                    key={day}
                    disabled={isDisabled}
                    onClick={() => onDateChange(date)}
                    className={`p-2 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200
                        ${isSelected ? 'bg-brand-primary text-white' : ''}
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-brand-light'}
                    `}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)}>&larr;</button>
                <h3 className="font-bold text-lg">{new Date(currentYear, currentMonth).toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)}>&rarr;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-2">
                {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {renderCalendarDays()}
            </div>
            <p className="text-xs text-gray-500 mt-4">*Rezerwacje muszą być składane najpóźniej 48 godzin przed planowanym rozpoczęciem.</p>
        </div>
    );
};


const BookingsPage: React.FC = () => {
  const [bookingType, setBookingType] = useState<BookingType>(BookingType.LESSON);
  
  const initialDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }, []);
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      setSelectedTime(null);
      try {
        const hours = await api.getAvailability(selectedDate);
        setAvailableHours(hours);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!selectedTime || !selectedDate) {
      setError('Proszę wybrać datę i godzinę.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.createBooking({
        type: bookingType,
        date: selectedDate,
        time: selectedTime,
      });
      setShowCountdown(true);
      setSelectedTime(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {showCountdown && <CountdownPopup onClose={() => setShowCountdown(false)} />}
      <h1 className="text-4xl font-bold text-center text-brand-secondary mb-8">Zarezerwuj swoją przygodę</h1>
      <BookingTypeSelector selected={bookingType} onSelect={setBookingType} />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-brand-dark">1. Wybierz datę</h2>
          <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-brand-dark">2. Wybierz godzinę</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {loading && <p>Wczytywanie dostępnych godzin...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && availableHours.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {availableHours.map(hour => (
                        <button
                            key={hour}
                            onClick={() => setSelectedTime(hour)}
                            className={`p-3 rounded-md text-center font-medium transition-colors duration-200
                            ${selectedTime === hour ? 'bg-brand-primary text-white' : 'bg-gray-100 hover:bg-brand-light'}`}
                        >
                            {hour}
                        </button>
                    ))}
                </div>
            )}
            {!loading && availableHours.length === 0 && (
                <p className="text-gray-500">Brak dostępnych terminów w tym dniu.</p>
            )}
          </div>
        </div>
      </div>

      {selectedTime && (
        <div className="mt-8 text-center bg-brand-light p-6 rounded-lg shadow-inner">
          <p className="text-lg font-semibold text-brand-secondary">
            Wybrano: {bookingType}, {selectedDate.toLocaleDateString('pl-PL')} o godzinie {selectedTime}.
          </p>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="mt-4 px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-accent transition-all duration-300 disabled:bg-gray-400"
          >
            {loading ? 'Przetwarzanie...' : 'Złóż prośbę o rezerwację'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
