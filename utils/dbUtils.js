export async function insertInDb(linksArr, model) {
  const data = await model.insertMany(linksArr);
  return data;
}

export async function queryDbArr(links, model) {
  const dbCachedLinks = await model.find({ link: { $in: links } });

  const linksDb = dbCachedLinks.map((link) => link.link);

  const toCheck = links.filter((link) => {
    if (!linksDb.includes(link)) return link;
  });

  const alreadyPresent = dbCachedLinks.filter((link) => {
    if (links.includes(link.link)) return link;
  });

  return [toCheck, alreadyPresent, dbCachedLinks];
}

export async function queryDbSingle(link, model) {
  const dbCachedLink = await model.findOne({ link });
  if (dbCachedLink) {
    return dbCachedLink;
  }
  return link;
}
