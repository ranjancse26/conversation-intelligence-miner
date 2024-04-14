import cheerio from 'cheerio';

function getYouTubeVideoId(url: string): string | null {
  const regex = /[?&]v=([^&#]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : null;
}

export default async function getTranscript(url: String): Promise<string> {
  const apiUrl = 'https://youtubetranscript.com';

  try {
    const videoId = getYouTubeVideoId(url);
    const response: Response = await fetch(`${apiUrl}?server_vid2=${videoId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch transcript: ${response.statusText}`);
    }

    // Read the response body as text
    const transcript = await response.text();
    const $ = cheerio.load(transcript, undefined, false);

    var filteredTranscript = $('transcript text').map((i, elem) => {
      const $a = $(elem);
      return {
        text: $a.text()
      };
    }).toArray()

    let stringTranscript = '';
    filteredTranscript.forEach(item => {
      stringTranscript += item.text + '\n';
    });

    return stringTranscript;

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return 'Error fetching transcript';
  }
}