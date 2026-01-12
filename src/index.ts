/**
 * Welcome to Cloudflare Workers!
 *
 * - Run `yarn dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 *   Tip: Test going to the /hello or /post.listPosts endpoints
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { appRouter } from './router';
import { instrument, ResolveConfigFn } from '@microlabs/otel-cf-workers';

const config: ResolveConfigFn = (env: {}, _trigger) => {
	return {
    exporter: {} as any,
		service: { name: 'greetings', spanAttributeMappings: { 'http.route': 'cf.worker.route' } },
	}
}


const handler = {
  async fetch(request: Request): Promise<Response> {
    return fetchRequestHandler({
      endpoint: '/',
      req: request,
      router: appRouter,
      createContext: () => ({}),
    });
  }
}

export default instrument(handler, config)

