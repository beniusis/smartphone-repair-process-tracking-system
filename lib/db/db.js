import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: "127.0.0.1",
    port: "3306",
    database: "smartphone_repair_db",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

export default async function execute({ query, values }) {
  try {
    const result = await db.query(query, values);
    await db.end();
    return result;
  } catch (error) {
    return { error };
  }
}
