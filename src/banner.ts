export default async function getBannerImage(content: String,
    apiKey: String, accountId: String): Promise<Uint8Array> {

    const model = "@cf/stabilityai/stable-diffusion-xl-base-1.0"
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    const headers = {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
    };
    const data = {
        'prompt': content
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const byteResponse = await streamToBytes(response.body);        
        return byteResponse;

    } catch (error) {
        console.error('An error occurred:', error);
    }

    async function streamToBytes(stream: ReadableStream): Promise<Uint8Array> {
        const chunks: Uint8Array[] = [];
        const reader = stream.getReader();
    
        while (true) {
            const { done, value } = await reader.read();
    
            if (done) {
                break;
            }
    
            chunks.push(value);
        }
    
        // Concatenate all chunks into a single Uint8Array
        const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
        const bytes = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.length;
        }
    
        return bytes;
    }
}