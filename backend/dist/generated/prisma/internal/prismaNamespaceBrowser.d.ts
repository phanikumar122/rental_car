import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Car: "Car";
    readonly Location: "Location";
    readonly Booking: "Booking";
    readonly Notification: "Notification";
    readonly Offer: "Offer";
    readonly Feedback: "Feedback";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly password: "password";
    readonly role: "role";
    readonly isBlocked: "isBlocked";
    readonly avatarUrl: "avatarUrl";
    readonly licenseUrl: "licenseUrl";
    readonly licenseVerified: "licenseVerified";
    readonly fcmToken: "fcmToken";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CarScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly type: "type";
    readonly fuel: "fuel";
    readonly transmission: "transmission";
    readonly seating: "seating";
    readonly mileage: "mileage";
    readonly pricePerDay: "pricePerDay";
    readonly pricePerHour: "pricePerHour";
    readonly images: "images";
    readonly imageKey: "imageKey";
    readonly availability: "availability";
    readonly locationId: "locationId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CarScalarFieldEnum = (typeof CarScalarFieldEnum)[keyof typeof CarScalarFieldEnum];
export declare const LocationScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly address: "address";
    readonly city: "city";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum];
export declare const BookingScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly carId: "carId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly totalAmount: "totalAmount";
    readonly status: "status";
    readonly userPhone: "userPhone";
    readonly userEmail: "userEmail";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly bookingId: "bookingId";
    readonly channel: "channel";
    readonly event: "event";
    readonly status: "status";
    readonly message: "message";
    readonly sentAt: "sentAt";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const OfferScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly discountPercentage: "discountPercentage";
    readonly validUntil: "validUntil";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OfferScalarFieldEnum = (typeof OfferScalarFieldEnum)[keyof typeof OfferScalarFieldEnum];
export declare const FeedbackScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly rating: "rating";
    readonly message: "message";
    readonly isApproved: "isApproved";
    readonly createdAt: "createdAt";
};
export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly password: "password";
    readonly avatarUrl: "avatarUrl";
    readonly licenseUrl: "licenseUrl";
    readonly fcmToken: "fcmToken";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const CarOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly mileage: "mileage";
    readonly imageKey: "imageKey";
    readonly locationId: "locationId";
};
export type CarOrderByRelevanceFieldEnum = (typeof CarOrderByRelevanceFieldEnum)[keyof typeof CarOrderByRelevanceFieldEnum];
export declare const LocationOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly address: "address";
    readonly city: "city";
};
export type LocationOrderByRelevanceFieldEnum = (typeof LocationOrderByRelevanceFieldEnum)[keyof typeof LocationOrderByRelevanceFieldEnum];
export declare const BookingOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly carId: "carId";
    readonly userPhone: "userPhone";
    readonly userEmail: "userEmail";
    readonly notes: "notes";
};
export type BookingOrderByRelevanceFieldEnum = (typeof BookingOrderByRelevanceFieldEnum)[keyof typeof BookingOrderByRelevanceFieldEnum];
export declare const NotificationOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly bookingId: "bookingId";
    readonly message: "message";
};
export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum];
export declare const OfferOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly code: "code";
};
export type OfferOrderByRelevanceFieldEnum = (typeof OfferOrderByRelevanceFieldEnum)[keyof typeof OfferOrderByRelevanceFieldEnum];
export declare const FeedbackOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly message: "message";
};
export type FeedbackOrderByRelevanceFieldEnum = (typeof FeedbackOrderByRelevanceFieldEnum)[keyof typeof FeedbackOrderByRelevanceFieldEnum];
