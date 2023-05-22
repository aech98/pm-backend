import { PrismaClient } from "@prisma/client";

class Database extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}

export default Database;
