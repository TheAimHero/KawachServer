import axios from 'axios';
import { load } from 'cheerio';
import { writeFile } from 'fs/promises';

async function getWebpageContent(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error.message);
    return null;
  }
}

function extractVisibleTextFromWebpage(htmlContent) {
  const $ = load(htmlContent);

  // Remove unwanted elements like scripts, styles, and links
  $('script, style, link').remove();

  // Extract only visible text (excluding HTML tags)
  const visibleText = $('body').text();

  // Filter out empty lines and extra whitespace
  const cleanedText = visibleText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .join('\n');

  return cleanedText;
}

export default async function hateSpeechProcess(url, textPath) {
  try {
    const webpageContent = await getWebpageContent(url);

    if (webpageContent) {
      const extractedText = extractVisibleTextFromWebpage(webpageContent);
      if (extractedText) await writeFile(textPath, extractedText);
      return true;
    }
  } catch (e) {
    console.error(e.message);
    return false;
  }
}
