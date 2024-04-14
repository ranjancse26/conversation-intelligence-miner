export default async function getKeywords(content: String,
    apiKey: String, accountId: String): Promise<string> {
    
    const model = "@cf/meta/llama-2-7b-chat-int8";
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    const headers = {
        'Authorization': 'Bearer '+ apiKey,
        'Content-Type': 'application/json'
    };
    const data = {
        messages: [
            { role: 'system', content: 'You are an expert Data Miner' },
            { role: 'user', content: `Extract all the keywords, make sure to return the aggregated keywords from the following content: ${content}. Do not return your own suggestions or recommendations.`}
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const responseData = await response.text();
        console.log(responseData);
        const jsonResponseData = JSON.parse(responseData);
        return jsonResponseData.result.response;
    } catch (error) {
        return "Error while creating a keywords";
    }
}