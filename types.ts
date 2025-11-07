
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  role: Role;
}

export enum BookingType {
  LESSON = 'Sama Lekcja',
  EQUIPMENT = 'Sprzęt',
  LESSON_AND_EQUIPMENT = 'Lekcja + Sprzęt'
}

export enum BookingStatus {
  PENDING = 'Wysłano prośbę',
  ACCEPTED = 'Zaakceptowano',
  REJECTED = 'Odrzucono',
  CANCELLED = 'Anulowano'
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  type: BookingType;
  date: Date;
  time: string;
  status: BookingStatus;
  createdAt: Date;
  rejectionReason?: string;
  price: number;
  details: string;
}

export interface Location {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  phone: string;
}

export enum LessonLevel {
    NOVICE = 'Nowicjusz',
    INTERMEDIATE = 'Średniozaawansowany',
    ADVANCED = 'Zaawansowany'
}

export interface LessonPrice {
    level: LessonLevel;
    duration: string;
    price: number;
}

export interface EquipmentPrice {
    item: string;
    size: string;
    priceHour: number;
    priceDay: number;
}
