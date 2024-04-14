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
	let trimmedContent = '';
	let summary = '';
	websocket.addEventListener('message', async ({ data }) => {
		const jsonData = JSON.parse(data);		
		switch(jsonData.command){
			case "GETBANNER":	
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				summary = await getSummary(trimmedContent, apiKey, accountId);
				const llmBannerResponse = await getBannerImage(summary, apiKey, accountId);
				const dataArray = Array.from(llmBannerResponse);
				const finalBannerResponse = {
					'type': 'BANNER',
					'content': dataArray,
					'summary': summary
				}
				websocket.send(JSON.stringify(finalBannerResponse));
				break;
			case "GETTRANSLATEDCONTENT":	
				console.log(data);
				const source = jsonData.source;
				const target = jsonData.target;
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmTranslationResponse = await getTranslatedContent(trimmedContent, source, target, apiKey, accountId);
				const finalTranslationResponse = {
					'type': 'TRANSLATEDCONTENT',
					'content': llmTranslationResponse
				}
				websocket.send(JSON.stringify(finalTranslationResponse));
				break;
			case "GETSENTIMENTS":	
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmSentimentResponse = await getSentiments(trimmedContent, apiKey, accountId);
				const finalSentimentResponse = {
					'type': 'SENTIMENTS',
					'content': llmSentimentResponse
				}
				websocket.send(JSON.stringify(finalSentimentResponse));
				break;
			case "GETASPECTS":	
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				summary = await getSummary(trimmedContent, apiKey, accountId);
				const llmAspectResponse = await getAspects(summary, apiKey, accountId);
				const finalAspectResponse = {
					'type': 'ASPECTS',
					'content': llmAspectResponse
				}
				websocket.send(JSON.stringify(finalAspectResponse));
				break;
			case "GETTRENDS":
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmTrendResponse = await getTrends(trimmedContent, apiKey, accountId);
				const finalTrendResponse = {
					'type': 'TRENDS',
					'content': llmTrendResponse
				}
				websocket.send(JSON.stringify(finalTrendResponse));
				break;
			case "GETRECOMMENDATIONS":
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmRecommendationResponse = await getRecommendations(trimmedContent, apiKey, accountId);
				const finalRecommendationResponse = {
					'type': 'RECOMMENDATIONS',
					'content': llmRecommendationResponse
				}
				websocket.send(JSON.stringify(finalRecommendationResponse));
				break;
			case "GETACTIONITEMS":
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmActionItemResponse = await getActionItems(trimmedContent, apiKey, accountId);
				const finalActionItemResponse = {
					'type': 'ACTIONITEMS',
					'content': llmActionItemResponse
				}
				websocket.send(JSON.stringify(finalActionItemResponse));
				break;
			case "GETTOPICS":
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmTopicResponse = await getTopics(trimmedContent, apiKey, accountId);
				const finalTopicResponse = {
					'type': 'TOPICS',
					'content': llmTopicResponse
				}
				websocket.send(JSON.stringify(finalTopicResponse));
				break;
			case "GETKEYWORDS":
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmKeywordResponse = await getKeywords(trimmedContent, apiKey, accountId);
				const finalKeywordResponse = {
					'type': 'KEYWORDS',
					'content': llmKeywordResponse
				}
				websocket.send(JSON.stringify(finalKeywordResponse));
				break;
			case "GETSUMMARY":
				console.log(data);
				trimmedContent = jsonData.content.substring(0, maxToken);
				const llmSummaryResponse = await getSummary(trimmedContent, apiKey, accountId);
				const finalSummaryResponse = {
					'type': 'SUMMARY',
					'content': llmSummaryResponse
				}
				websocket.send(JSON.stringify(finalSummaryResponse));
				break;
			case "GETTRANSCRIPT":
				console.log(data);
				const transcript = await getTranscript(data);
				const finalTranscriptResponse = {
					'type': 'TRANSCRIPT',
					'content': transcript
				}
				websocket.send(JSON.stringify(finalTranscriptResponse));
				break;
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