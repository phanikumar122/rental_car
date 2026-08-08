export declare const sendEmail: (to: string, subject: string, html: string) => Promise<boolean>;
type BookingInfo = {
    id: string;
    startDate: Date;
    endDate: Date;
    car: {
        name: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
};
export declare const notifyBookingCreated: (booking: BookingInfo) => Promise<void>;
export declare const notifyBookingConfirmed: (booking: BookingInfo) => Promise<void>;
export declare const notifyBookingRejected: (booking: BookingInfo) => Promise<void>;
export declare const notifyBookingCancelled: (booking: BookingInfo) => Promise<void>;
export declare const notifyReminder: (booking: BookingInfo, type: "REMINDER_24H" | "REMINDER_1H") => Promise<void>;
export {};
