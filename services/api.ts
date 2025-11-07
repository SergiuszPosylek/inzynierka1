import { User, Role, Booking, BookingType, BookingStatus } from '../types';
import { AVAILABLE_HOURS } from '../constants';

// --- Types ---
export interface Credentials {
  email: string;
  password: string;
}


// --- Mock Database using localStorage ---
const USERS_KEY = 'kite_users';
const BOOKINGS_KEY = 'kite_bookings';

const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

const getStoredBookings = (): Booking[] => {
  try {
    const bookings = localStorage.getItem(BOOKINGS_KEY);
    if (!bookings) return [];
    // Need to parse dates correctly from JSON strings
    return JSON.parse(bookings).map((b: any) => ({
        ...b,
        date: new Date(b.date),
        createdAt: new Date(b.createdAt)
    }));
  } catch (e) {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};


// --- Mock API implementation ---
class MockApi {

  private users: User[];
  private bookings: Booking[];

  constructor() {
    this.users = getStoredUsers();
    this.bookings = getStoredBookings();

    if (this.users.length === 0) {
      this.users = [
        { id: 'admin1', email: 'admin1@kiteschool.pl', role: Role.ADMIN },
        { id: 'admin2', email: 'admin2@kiteschool.pl', role: Role.ADMIN },
        { id: 'admin3', email: 'admin3@kiteschool.pl', role: Role.ADMIN },
        { id: 'user_123', email: 'test@example.com', role: Role.USER },
      ];
      saveUsers(this.users);
    }
    
    if (this.bookings.length === 0) {
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

        this.bookings = [
            {
                id: 'booking_1', userId: 'user_123', userEmail: 'test@example.com',
                type: BookingType.LESSON, date: dayAfter, time: '10:00',
                status: BookingStatus.PENDING, createdAt: new Date(), price: 180, details: 'Lekcja'
            },
            {
                id: 'booking_2', userId: 'user_123', userEmail: 'test@example.com',
                type: BookingType.LESSON_AND_EQUIPMENT, date: dayAfterTomorrow, time: '12:00',
                status: BookingStatus.ACCEPTED, createdAt: new Date(Date.now() - 60*1000), price: 250, details: 'Lekcja + Sprzęt'
            }
        ];
        saveBookings(this.bookings);
    }
  }

  private findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }
  
  // Auth
  async login(credentials: Credentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let potentialAdminEmail = credentials.email;
        const adminUsernames = ['admin1', 'admin2', 'admin3'];

        // Check if user provided a short admin username (e.g., 'admin1')
        if (adminUsernames.includes(credentials.email)) {
          potentialAdminEmail = `${credentials.email}@kiteschool.pl`;
        }
        
        // Check if the email (either original or constructed) is an admin email
        if (potentialAdminEmail.startsWith('admin') && potentialAdminEmail.endsWith('@kiteschool.pl')) {
            const user = this.findUserByEmail(potentialAdminEmail);
            const expectedPassword = potentialAdminEmail.split('@')[0];
            
            if (user && credentials.password === expectedPassword) {
                return resolve(user);
            } else {
                return reject(new Error('Nieprawidłowe dane logowania administratora.'));
            }
        }

        // Regular user check
        const user = this.findUserByEmail(credentials.email);
        if (user) {
            // In a real app, you'd check a hashed password. For this mock, any password is fine.
            resolve(user);
        } else {
            reject(new Error('Użytkownik nie istnieje. Proszę się zarejestrować.'));
        }
      }, 500);
    });
  }

  async register(credentials: Credentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.findUserByEmail(credentials.email)) {
          reject(new Error('Użytkownik o tym adresie e-mail już istnieje.'));
        } else {
          const newUser: User = {
            id: `user_${Date.now()}`,
            email: credentials.email,
            role: Role.USER
          };
          this.users.push(newUser);
          saveUsers(this.users);
          resolve(newUser);
        }
      }, 500);
    });
  }
  
  async logout(): Promise<void> {
      return Promise.resolve();
  }

  // Bookings
  async getAvailability(date: Date): Promise<string[]> {
      return new Promise((resolve) => {
          setTimeout(() => {
              const bookedHours = this.bookings
                  .filter(b => new Date(b.date).toDateString() === date.toDateString() && b.status === BookingStatus.ACCEPTED)
                  .map(b => b.time);
              
              const available = AVAILABLE_HOURS.filter(h => !bookedHours.includes(h));
              resolve(available);
          }, 300);
      });
  }
  
  async createBooking(data: { type: BookingType, date: Date, time: string }): Promise<Booking> {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const userStr = localStorage.getItem('user');
              if (!userStr) {
                  return reject(new Error('Użytkownik niezalogowany.'));
              }
              const user: User = JSON.parse(userStr);
              
              const newBooking: Booking = {
                  id: `booking_${Date.now()}`,
                  userId: user.id,
                  userEmail: user.email,
                  type: data.type,
                  date: data.date,
                  time: data.time,
                  status: BookingStatus.PENDING,
                  createdAt: new Date(),
                  price: 150, // Mock price
                  details: `Rezerwacja: ${data.type}`
              };
              
              this.bookings.push(newBooking);
              saveBookings(this.bookings);
              resolve(newBooking);
          }, 500);
      });
  }
  
  async getUserBookings(userId: string): Promise<Booking[]> {
      return new Promise((resolve) => {
          setTimeout(() => {
              const userBookings = this.bookings.filter(b => b.userId === userId);
              resolve(userBookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }, 300);
      });
  }
  
  async getAllBookings(): Promise<Booking[]> {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(this.bookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }, 300);
      });
  }
  
  async updateBookingStatus(bookingId: string, status: BookingStatus, role?: Role, reason?: string): Promise<Booking> {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
              if (bookingIndex === -1) {
                  return reject(new Error('Nie znaleziono rezerwacji.'));
              }
              
              const isStatusChangeByAdmin = status === BookingStatus.ACCEPTED || status === BookingStatus.REJECTED;
              if (isStatusChangeByAdmin && role !== Role.ADMIN) {
                  return reject(new Error('Brak uprawnień.'));
              }
              
              this.bookings[bookingIndex].status = status;
              if (status === BookingStatus.REJECTED && reason) {
                  this.bookings[bookingIndex].rejectionReason = reason;
              }
              
              saveBookings(this.bookings);
              resolve(this.bookings[bookingIndex]);
          }, 500);
      });
  }
}

export const api = new MockApi();