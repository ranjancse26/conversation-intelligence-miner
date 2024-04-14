import template from './youtube-index';
import getTranscript from './youtube-transcript';
import getSummary from './summary';
import getKeywords from './keywords';
import getActionItems from './actionitems';
import getRecommendations from './recommendations';
import getTrends from './trendanalysis';
import getAspects from './aspectmining';
import getBannerImage from './banner';
import getTopics from './topics';
import getTranslatedContent from './translation';
import getSentiments from './sentimentanalysis';

async function handleSession(websocket) {
	websocket.accept();
	websocket.addEventListener('message', async ({ data }) => {
		var jsonData = JSON.parse(data);
		if(jsonData.command === "GETBANNER"){
			// Handle Banner Image		
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const summary = await getSummary(trimmedContent, apiKey, accountId);
			const llmResponse = await getBannerImage(summary, apiKey, accountId);
			const dataArray = Array.from(llmResponse);
			const finalResponse = {
				'type': 'BANNER',
				'content': dataArray,
				'summary': summary
			}
			websocket.send(JSON.stringify(finalResponse));
		}		
		else if(jsonData.command === "GETTRANSLATEDCONTENT"){
			// Handle Transcript Language Translation		
			console.log(data);
			const source = jsonData.source;
			const target = jsonData.target;
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getTranslatedContent(trimmedContent, source, target, apiKey, accountId);
			const finalResponse = {
				'type': 'TRANSLATEDCONTENT',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETSENTIMENTS"){
			// Handle Transcript Sentiments		
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getSentiments(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'SENTIMENTS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETASPECTS"){
			// Handle Transcript Aspects		
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const summary = await getSummary(trimmedContent, apiKey, accountId);
			const llmResponse = await getAspects(summary, apiKey, accountId);
			const finalResponse = {
				'type': 'ASPECTS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETTRENDS"){
			// Handle Transcript Trends		
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getTrends(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'TRENDS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETRECOMMENDATIONS"){
			// Handle Transcript Recommendations		
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getRecommendations(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'RECOMMENDATIONS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETACTIONITEMS"){
			// Handle Transcript Action Items			
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getActionItems(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'ACTIONITEMS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETTOPICS"){
			// Handle Transcript Topics			
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getTopics(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'TOPICS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETKEYWORDS"){
			// Handle Transcript Keywords			
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getKeywords(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'KEYWORDS',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}
		else if(jsonData.command === "GETSUMMARY"){
			// Handle Transcript Summary			
			console.log(data);
			const trimmedContent = jsonData.content.substring(0, maxToken);
			const llmResponse = await getSummary(trimmedContent, apiKey, accountId);
			const finalResponse = {
				'type': 'SUMMARY',
				'content': llmResponse
			}
			websocket.send(JSON.stringify(finalResponse));
		}else if(jsonData.command === "GETTRANSCRIPT"){
			// Handle Fetching Transcript
			console.log(data);
			const transcript = await getTranscript(data);
			const finalResponse = {
				'type': 'TRANSCRIPT',
				'content': transcript
			}
			websocket.send(JSON.stringify(finalResponse));
		}		
	});

	websocket.addEventListener('close', async evt => {
		console.log(evt);
	});
}

async function websocketHandler(req) {
	const upgradeHeader = req.headers.get('Upgrade');
	if (upgradeHeader !== 'websocket') {
		return new Response('Expected websocket', { status: 400 });
	}

	const [client, server] = Object.values(new WebSocketPair());
	await handleSession(server);

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}

let maxToken = '';
let apiKey = '';
let accountId = '';

export interface Env {
	CLOUDFLARE_ACCOUNT_ID: string;
	CLOUDFLARE_ACCOUNT_API_KEY: string;
	CLOUDFLARE_API_MAX_TOKEN: string
}

export default {
	async fetch(request: Request, env: Env,) {
		try {
			apiKey = env.CLOUDFLARE_ACCOUNT_API_KEY;
			accountId = env.CLOUDFLARE_ACCOUNT_ID;
			maxToken = env.CLOUDFLARE_API_MAX_TOKEN;

			const url = new URL(request.url);
			switch (url.pathname) {
				case '/':
					return template();
				case '/ws':
					return await websocketHandler(request);
				default:
					return new Response('Not found', { status: 404 });
			}
		} catch (err) {
			let e = err;
			return new Response(e.toString());
		}
	},
};