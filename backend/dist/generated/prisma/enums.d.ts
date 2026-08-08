export declare const Role: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const CarType: {
    readonly SUV: "SUV";
    readonly Sedan: "Sedan";
    readonly Hatchback: "Hatchback";
    readonly Luxury: "Luxury";
    readonly MUV: "MUV";
    readonly Minivan: "Minivan";
};
export type CarType = (typeof CarType)[keyof typeof CarType];
export declare const FuelType: {
    readonly Petrol: "Petrol";
    readonly Diesel: "Diesel";
    readonly Electric: "Electric";
    readonly Hybrid: "Hybrid";
    readonly CNG: "CNG";
};
export type FuelType = (typeof FuelType)[keyof typeof FuelType];
export declare const Transmission: {
    readonly Manual: "Manual";
    readonly Automatic: "Automatic";
    readonly AMT: "AMT";
};
export type Transmission = (typeof Transmission)[keyof typeof Transmission];
export declare const BookingStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly CANCELLED: "CANCELLED";
    readonly COMPLETED: "COMPLETED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const NotificationChannel: {
    readonly EMAIL: "EMAIL";
    readonly SMS: "SMS";
    readonly WHATSAPP: "WHATSAPP";
    readonly PUSH: "PUSH";
};
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
export declare const NotificationEvent: {
    readonly BOOKING_CREATED: "BOOKING_CREATED";
    readonly BOOKING_CONFIRMED: "BOOKING_CONFIRMED";
    readonly BOOKING_REJECTED: "BOOKING_REJECTED";
    readonly BOOKING_CANCELLED: "BOOKING_CANCELLED";
    readonly REMINDER_24H: "REMINDER_24H";
    readonly REMINDER_1H: "REMINDER_1H";
    readonly MANUAL: "MANUAL";
};
export type NotificationEvent = (typeof NotificationEvent)[keyof typeof NotificationEvent];
export declare const NotificationStatus: {
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
    readonly PENDING: "PENDING";
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
