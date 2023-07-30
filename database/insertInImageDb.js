import connection from './dbConnect.js';

export default async function insertInImageDb(linksArr) {
  if (linksArr.length === 0) return;
  const query = 'INSERT INTO links_table (links) VALUES ?';
  const valuetoinsert = linksArr.map((value) => [value]);
  const res = await connection.query(query, [valuetoinsert]);
  return;
}
