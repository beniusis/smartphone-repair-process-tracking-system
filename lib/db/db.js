import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: "127.0.0.1",
    port: "3306",
    database: "smartphone_repair_db",
    user: "dbuser",
    password:
      "5Y8vFXnF7Fn3wEHEsqWampwBmwL9pTnb6Ec7EvIPrMvYhBncBXc6Ghw9ManYeqL2",
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
