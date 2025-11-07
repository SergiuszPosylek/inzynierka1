
import React from 'react';
// FIX: Removed unused and non-existent 'LESSON_LEVELS' import.
import { LESSON_PRICES, EQUIPMENT_PRICES } from '../constants';
import { LessonLevel, type LessonPrice, type EquipmentPrice } from '../types';

const PriceTable: React.FC<{ title: string; headers: string[]; data: (string|number)[][] }> = ({ title, headers, data }) => (
    <div className="overflow-x-auto">
        <h3 className="text-2xl font-semibold text-brand-secondary mb-4">{title}</h3>
        <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-brand-secondary text-white">
                <tr>
                    {headers.map(header => (
                        <th key={header} className="text-left py-3 px-4 uppercase font-semibold text-sm">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-gray-700">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-200 hover:bg-brand-light">
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-3 px-4">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const PricingPage: React.FC = () => {
    const lessonDataByLevel = (level: LessonLevel) => 
        LESSON_PRICES
            .filter(item => item.level === level)
            .map(item => [item.duration, `${item.price} PLN`]);

    const equipmentData = EQUIPMENT_PRICES.map(item => [item.item, item.size, `${item.priceHour} PLN`, `${item.priceDay} PLN`]);

    return (
        <div className="space-y-12">
            <h1 className="text-4xl font-bold text-center text-brand-secondary mb-8">Cennik</h1>
            
            <div>
                <h2 className="text-3xl font-bold text-brand-secondary mb-6 border-b-2 border-brand-primary pb-2">Lekcje</h2>
                <div className="space-y-8">
                    {Object.values(LessonLevel).map(level => (
                        <PriceTable
                            key={level}
                            title={level}
                            headers={['Czas trwania', 'Cena']}
                            data={lessonDataByLevel(level)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-brand-secondary mb-6 border-b-2 border-brand-primary pb-2">Wypożyczenie Sprzętu</h2>
                <PriceTable 
                    title="Cennik wypożyczenia"
                    headers={['Sprzęt', 'Rozmiar', 'Cena za godzinę', 'Cena za dzień']}
                    data={equipmentData}
                />
            </div>
        </div>
    );
};

export default PricingPage;