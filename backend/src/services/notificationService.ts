import nodemailer from 'nodemailer';
import prisma     from '../prismaClient';

// ─── Transporter (Email) ──────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env['SMTP_HOST'] || 'smtp.gmail.com',
  port:   Number(process.env['SMTP_PORT']) || 587,
  secure: false,
  auth: {
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
});

// ─── Low-level senders ───────────────────────────────────────────────────────

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!process.env['SMTP_USER'] || process.env['SMTP_USER'] === 'your@gmail.com') {
      console.log(`[Email MOCK] To: ${to} | Subject: ${subject}`);
      return true;
    }
    await transporter.sendMail({ from: process.env['SMTP_FROM'], to, subject, html });
    return true;
  } catch (err) {
    console.error('[sendEmail]', err);
    return false;
  }
};

// ─── Notification record helper ───────────────────────────────────────────────
type NotifyPayload = {
  userId?:    string;
  bookingId?: string;
  channel:    'EMAIL' | 'SMS' | 'WHATSAPP';
  event:      'BOOKING_CREATED' | 'BOOKING_CONFIRMED' | 'BOOKING_REJECTED' | 'BOOKING_CANCELLED' | 'REMINDER_24H' | 'REMINDER_1H' | 'MANUAL';
  message:    string;
  success:    boolean;
};

const recordNotification = async (p: NotifyPayload) => {
  try {
    await prisma.notification.create({
      data: {
        userId:    p.userId,
        bookingId: p.bookingId,
        channel:   p.channel,
        event:     p.event,
        message:   p.message,
        status:    p.success ? 'SENT' : 'FAILED',
        sentAt:    p.success ? new Date() : undefined,
      },
    });
  } catch (e) {
    console.error('[recordNotification]', e);
  }
};

// ─── High-level notification functions ───────────────────────────────────────

type BookingInfo = {
  id:        string;
  startDate: Date;
  endDate:   Date;
  car:       { name: string };
  user:      { id: string; name: string; email: string };
};

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const getAdminEmail = async (): Promise<string> => {
  const admin = await prisma.user.findFirst({
    where:  { role: 'ADMIN' },
    select: { email: true }
  });
  return admin?.email || process.env['ADMIN_EMAIL'] || 'admin@royalcartravels.com';
};

export const notifyBookingCreated = async (booking: BookingInfo) => {
  const { user, car } = booking;
  const subject = `Booking Request — ${car.name}`;
  const html    = `
    <h2>Hi ${user.name},</h2>
    <p>Your booking request has been received!</p>
    <table>
      <tr><td><b>Booking ID</b></td><td>${booking.id}</td></tr>
      <tr><td><b>Car</b></td><td>${car.name}</td></tr>
      <tr><td><b>Pickup</b></td><td>${formatDate(booking.startDate)}</td></tr>
      <tr><td><b>Return</b></td><td>${formatDate(booking.endDate)}</td></tr>
      <tr><td><b>Status</b></td><td>Pending — awaiting admin confirmation</td></tr>
    </table>
    <p>We'll notify you once it's confirmed.</p>
  `;
  
  const pushBody  = `Your booking for ${car.name} is being processed.`;

  const emailOk = await sendEmail(user.email, subject, html);
  await recordNotification({ userId: user.id, bookingId: booking.id, channel: 'EMAIL', event: 'BOOKING_CREATED', message: pushBody, success: emailOk });

  // ─── Admin Notification ───
  const adminEmail = await getAdminEmail();
  const adminSubject = `New Booking Alert! 🚨 — ${car.name}`;
  const adminHtml = `
    <h2>New Booking Received!</h2>
    <p>A new booking request has been placed on the website.</p>
    <hr />
    <h3>Customer Details:</h3>
    <ul>
      <li><b>Name:</b> ${user.name}</li>
      <li><b>Email:</b> ${user.email}</li>
    </ul>
    <h3>Booking Details:</h3>
    <table>
      <tr><td><b>Booking ID:</b></td><td>${booking.id}</td></tr>
      <tr><td><b>Car:</b></td><td>${car.name}</td></tr>
      <tr><td><b>Pickup:</b></td><td>${formatDate(booking.startDate)}</td></tr>
      <tr><td><b>Return:</b></td><td>${formatDate(booking.endDate)}</td></tr>
    </table>
    <br />
    <p><a href="${process.env['FRONTEND_URL']}/admin/bookings">View in Admin Panel</a></p>
  `;
  await sendEmail(adminEmail, adminSubject, adminHtml);
};

export const notifyBookingConfirmed = async (booking: BookingInfo) => {
  const { user, car } = booking;
  const subject = `Booking Confirmed ✅ — ${car.name}`;
  const html  = `<h2>Hi ${user.name},</h2><p>Great news! Your booking for <b>${car.name}</b> (ID: ${booking.id}) has been <b>CONFIRMED</b>.</p><p>Pickup: ${formatDate(booking.startDate)}</p>`;
  
  const emailOk = await sendEmail(user.email, subject, html);
  await recordNotification({ userId: user.id, bookingId: booking.id, channel: 'EMAIL', event: 'BOOKING_CONFIRMED', message: html, success: emailOk });
};

export const notifyBookingRejected = async (booking: BookingInfo) => {
  const { user, car } = booking;
  const subject = `Booking Update — ${car.name}`;
  const html   = `<h2>Hi ${user.name},</h2><p>Unfortunately, your booking for <b>${car.name}</b> (ID: ${booking.id}) has been <b>rejected</b>. Please contact us for assistance.</p>`;
  
  const emailOk = await sendEmail(user.email, subject, html);
  await recordNotification({ userId: user.id, bookingId: booking.id, channel: 'EMAIL', event: 'BOOKING_REJECTED', message: html, success: emailOk });
};

export const notifyBookingCancelled = async (booking: BookingInfo) => {
  const { user, car } = booking;
  const subject = `Booking Cancelled — ${car.name}`;
  const html   = `<h2>Hi ${user.name},</h2><p>Your booking for <b>${car.name}</b> (ID: ${booking.id}) has been <b>cancelled</b>.</p>`;
  
  const emailOk = await sendEmail(user.email, subject, html);
  await recordNotification({ userId: user.id, bookingId: booking.id, channel: 'EMAIL', event: 'BOOKING_CANCELLED', message: html, success: emailOk });

  // ─── Admin Notification ───
  const adminEmail = await getAdminEmail();
  const adminSubject = `Booking Cancelled ⚠️ — ${car.name}`;
  const adminHtml = `
    <h2>Booking Cancelled</h2>
    <p>The following booking has been cancelled by the customer:</p>
    <hr />
    <p><b>Booking ID:</b> ${booking.id}</p>
    <p><b>Customer:</b> ${user.name} (${user.email})</p>
    <p><b>Car:</b> ${car.name}</p>
    <br />
    <p><a href="${process.env['FRONTEND_URL']}/admin/bookings">View in Admin Panel</a></p>
  `;
  await sendEmail(adminEmail, adminSubject, adminHtml);
};

export const notifyReminder = async (booking: BookingInfo, type: 'REMINDER_24H' | 'REMINDER_1H') => {
  const { user, car } = booking;
  const label  = type === 'REMINDER_24H' ? '24 hours' : '1 hour';
  
  const emailSubject = `Reminder: Your car pickup is in ${label}!`;
  const emailHtml    = `<p>Hi ${user.name}, your rental of <b>${car.name}</b> starts in <b>${label}</b>!</p><p>Pickup: ${formatDate(booking.startDate)}</p>`;

  const emailOk = await sendEmail(user.email, emailSubject, emailHtml);
  await recordNotification({ userId: user.id, bookingId: booking.id, channel: 'EMAIL', event: type, message: emailHtml, success: emailOk });
};

