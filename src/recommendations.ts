export default async function getRecommendations(content: String,
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
            { role: 'user', content: `Provide some recomemndations on similar content, based on the following content: ${content}`}
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
        return "Error while getting a recommendations";
    }
}