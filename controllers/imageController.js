import checkImageDb from '../database/checkImageDb.js';
import checkImageLink from '../utils/checkImageLink.js';

export async function processImage(req, res) {
  const { links } = req.body;
  const linksInDb = await checkImageDb(links);
  const toCheck = links.filter((link) => !linksInDb.includes(link)); // get the links that are in the db
  const badLinksByModel = await checkImageLink(toCheck);
  const badLinks = linksInDb.concat(badLinksByModel).filter((link) => {
    return Boolean(link);
  });
  res.status(200).json({ message: 'status', data: badLinks });
}
