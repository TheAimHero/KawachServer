import connection from "./dbConnect.js";

export default async function checkImageDb(links) {
  const query = `SELECT links FROM links_table WHERE links IN (${links
    .map((name) => `'${name}'`)
    .join(",")})`;
  const res = await connection.query(query);
  const linkArr = res[0].map((linkObj) => {
    return linkObj.links;
  });
  return linkArr;
}
