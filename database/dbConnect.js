import process from 'process';

import { createConnection } from 'mysql2/promise';

const connection = await createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export function dbConnect() {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to the database!');
  });
}

export default connection;
