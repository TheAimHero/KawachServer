import imageModel from '../utils/modelUtils.js';

export async function aggregateImage(req, res) {
  const agg = await imageModel.({ type: 'nsfw' }).sort('numAccessed');
  console.log(agg);
  res.status(200).json({ message: 'hello' });
}
