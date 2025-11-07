
import { LessonLevel, type Location, type LessonPrice, type EquipmentPrice } from './types';

export const LOCATIONS: Location[] = [
  {
    id: 'jastarnia',
    name: 'Jastarnia',
    imageUrl: 'https://picsum.photos/seed/jastarnia/600/400',
    email: 'jastarnia@kiteschool.pl',
    phone: '+48 123 456 789'
  },
  {
    id: 'rew',
    name: 'Rewa',
    imageUrl: 'https://picsum.photos/seed/rewa/600/400',
    email: 'rewa@kiteschool.pl',
    phone: '+48 987 654 321'
  },
  {
    id: 'chalupy',
    name: 'Chałupy',
    imageUrl: 'https://picsum.photos/seed/chalupy/600/400',
    email: 'chalupy@kiteschool.pl',
    phone: '+48 555 444 333'
  }
];

export const LESSON_PRICES: LessonPrice[] = [
    { level: LessonLevel.NOVICE, duration: '1 godzina', price: 150 },
    { level: LessonLevel.NOVICE, duration: '2 godziny', price: 280 },
    { level: LessonLevel.NOVICE, duration: 'Pakiet 5 godzin', price: 700 },
    { level: LessonLevel.INTERMEDIATE, duration: '1 godzina', price: 180 },
    { level: LessonLevel.INTERMEDIATE, duration: '2 godziny', price: 340 },
    { level: LessonLevel.INTERMEDIATE, duration: 'Pakiet 5 godzin', price: 850 },
    { level: LessonLevel.ADVANCED, duration: '1 godzina (freestyle)', price: 220 },
    { level: LessonLevel.ADVANCED, duration: '2 godziny (freestyle)', price: 400 },
];

export const EQUIPMENT_PRICES: EquipmentPrice[] = [
    { item: 'Deska', size: 'S/M', priceHour: 50, priceDay: 200 },
    { item: 'Deska', size: 'L/XL', priceHour: 60, priceDay: 220 },
    { item: 'Latawiec', size: '7m-9m', priceHour: 80, priceDay: 300 },
    { item: 'Latawiec', size: '10m-13m', priceHour: 90, priceDay: 340 },
    { item: 'Trapez', size: 'Uniwersalny', priceHour: 30, priceDay: 100 },
];

export const AVAILABLE_HOURS: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];
