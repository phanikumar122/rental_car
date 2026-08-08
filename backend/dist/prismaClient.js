import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const dbUrl = new URL(process.env['DATABASE_URL']);
const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.substring(1),
});
const prisma = new PrismaClient({ adapter });
export default prisma;
//# sourceMappingURL=prismaClient.js.map