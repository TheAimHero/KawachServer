import { insertInDbSingle, queryDbSingle } from '../utils/dbUtils.js';
import imageLinkModel from '../dbModel/imageLinkModel.js';

export async function processUserRate(req, res) {
  try {
    const { imgSrc: link } = req.body;

    if (!link.startsWith('http')) {
      return res.status(200).json({ status: 'error', message: 'Invalid Link' });
    }

    const response = await fetch(link);
    const contentType = response.headers.get('content-type');
    if (contentType.split('/')[0] !== 'image') {
      return res
        .status(200)
        .json({ status: 'error', message: 'Invalid File Format' });
    }
    await insertInDbSingle({ link }, imageLinkModel).catch(async (err) => {
      if (err.code === 11000) {
        const doc = await queryDbSingle(link, imageLinkModel);
        doc.accessedAmt += 1;
        doc.save();
      } else {
        throw new Error('Unknown Error');
      }
    });
    return res.status(200).json({ status: 'success', data: true });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
