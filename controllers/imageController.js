import { insertInDb, queryDbArr } from '../utils/dbUtils.js';
import checkImageLink from '../check/checkImageLink.js';
import imageModel from '../dbModel/imageModel.js';

export async function processImage(req, res) {
  const { links } = req.body;
  const [toCheck, alreadyPresent, dbCacheLinks] = await queryDbArr(
    links,
    imageModel
  );

  if (toCheck.length === 0) {
    return res.status(200).json({ message: 'status', data: dbCacheLinks });
  }

  const modelResults = await checkImageLink(toCheck);

  await insertInDb(modelResults, imageModel);

  res
    .status(200)
    .json({ message: 'status', data: { ...alreadyPresent, ...modelResults } });
}
