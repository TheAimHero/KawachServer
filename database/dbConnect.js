import { createConnection } from "mysql2/promise";

const connection = await createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "links",
});

export function dbConnect() {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      return;
    }
    console.log("Connected to the database!");
  });
}

export default connection;
