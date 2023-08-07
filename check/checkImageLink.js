import { Buffer } from 'buffer';
import axios from 'axios';

import model, { checkNsfw, preProcessImage } from '../utils/modelUtils.js';

export default async function checkImageLink(links) {
  const promiseArr = links.map(async (link) => {
    const response = await axios.get(link, { responseType: 'arraybuffer' });
    // eslint-disable-next-line no-undef

    const buf = Buffer.from(response.data, 'binary');
    const preProcessedImage = preProcessImage(buf);
    const outputTensor = model.predict(preProcessedImage);
    if (await checkNsfw(outputTensor)) return { link, type: 'nsfw' };
    return { link, type: 'sfw' };
  });

  const result = (await Promise.all(promiseArr)).filter((link) =>
    Boolean(link)
  );

  return result;
}
