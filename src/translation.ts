export default async function getTranslatedContent(content: String,
    source: String, target: String,
    apiKey: String, accountId: String): Promise<string> {
    
    const model = "@cf/meta/m2m100-1.2b";
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    const headers = {
        'Authorization': 'Bearer '+ apiKey,
        'Content-Type': 'application/json'
    };
    const data = {
        "text": content, 
        "source_lang": source, 
        "target_lang": target 
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
        return jsonResponseData.result.translated_text;
    } catch (error) {
        return "Error while performing the language translation.";
    }
}