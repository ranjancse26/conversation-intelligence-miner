# Conversation-Intelligence-Miner
The CloudFlare-Based Conversational Intelligence Miner. Demo - https://aged-pine-90e8.ranjan-dailata.workers.dev/

# Architecture

![Architecture](https://github.com/ranjancse26/conversation-intelligence-miner/assets/2565797/f964a55f-5c10-4612-9586-57862f51692b)

# ​​Prerequisites
- Sign up for a Cloudflare account. https://dash.cloudflare.com/sign-up/workers-and-pages
- Install npm. https://docs.npmjs.com/getting-started
- Install Node.js. https://nodejs.org/en/

# Getting Started
Please read this blog post before you dive into the internals - 
[DEV Post](https://dev.to/ranjancse/conversation-intelligence-miner-15bl-temp-slug-8794048)

- [Login to Cloudflare](https://dash.cloudflare.com/)
- [Create a new token](https://dash.cloudflare.com/profile/api-tokens)
- [Install Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

# Get the Account ID

- Log in to the Cloudflare dashboard.
- Select your account.
- Go to Workers & Pages.
- On the right side of the page, you will see the "Account Id". Please refer to this post - [Find Account Id](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids)

- Copy the Account ID and the Access Token that you have created before under the Getting Started Section.
- Replace the following
 ```
[vars]
CLOUDFLARE_ACCOUNT_ID = ""
CLOUDFLARE_ACCOUNT_API_KEY = ""
```
- Run the product on DEV - npx wrangler dev
- Deploy the product on Cloudflare - npx wrangler deploy
- Note - If you wish to create a new Worker AI Project, Please use the command - npm create cloudflare@2 and following the step by step process.



