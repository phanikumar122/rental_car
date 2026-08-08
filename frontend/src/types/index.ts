// ─── Shared Entity Types ──────────────────────────────────────────────────────
// Single source of truth for all entity shapes.

export interface User {
  id:              string;
  name:            string;
  email:           string;
  phone?:          string;
  role:            'USER' | 'ADMIN';
  isBlocked?:      boolean;
  avatarUrl?:      string;
  licenseUrl?:     string;
  licenseVerified?: boolean;
  address?:         string;
}

export interface Location {
  id:      string;
  name:    string;
  address: string;
  city:    string;
}

export interface Car {
  id:           string;
  name:         string;
  type:         string;
  fuel:         string;
  transmission: string;
  seating:      number;
  mileage?:     string;
  pricePerDay:  number;
  pricePerHour?: number;
  images:       string[];
  imageKey?:    string; // legacy
  availability: boolean;
  locationId:   string;
  location:     Location;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id:          string;
  userId:      string;
  carId:       string;
  startDate:   string;
  endDate:     string;
  totalAmount: number;
  status:      BookingStatus;
  notes?:      string;
  userPhone?:  string;
  userEmail?:  string;
  car:         Car;
  user?:       User; // added for admin endpoints
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}

export interface AdminStats {
  totalBookings:   number;
  pendingBookings: number;
  activeUsers:     number;
  availableCars:   number;
  revenue:         number;
}

export interface Feedback {
  id:         string;
  name:       string;
  email:      string;
  rating:     number;
  message:    string;
  isApproved: boolean;
  createdAt:  string;
}
