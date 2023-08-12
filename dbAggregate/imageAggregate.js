import imageModel from '../dbModel/imageModel.js';

export async function aggregateImage(req, res) {
  try {
    const data = await imageModel
      .find({ type: 'nsfw' })
      .select('-_id -__v')
      .sort('-numAccessed');

    return res.status(200).json({ status: 'success', data });
  } catch (e) {
    console.log(e);
  }
}
