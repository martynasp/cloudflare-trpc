import { initTRPC } from '@trpc/server';
import { env } from 'cloudflare:workers';
import { z } from 'zod';

let id = 0;

const db = {
  posts: [
    {
      id: ++id,
      title: 'hello',
    },
  ],
};

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const postRouter = router({
  createPost: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ input }) => {
      const post = {
        id: ++id,
        ...input,
      };
      db.posts.push(post);
      return post;
    }),
  listPosts: publicProcedure.query(() => db.posts),
});

export const appRouter = router({
  post: postRouter,
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    console.log('Hello Input:', input);
    return `hello ${input ?? 'world'}`;
  }),
  "": publicProcedure.input(z.string().nullish()).query(async ({ input }) => {
   const stmt = env.DB.prepare("SELECT * FROM comments LIMIT 3");
		const { results } = await stmt.all();
    return `root: ${input ?? 'world'}, comments: ${JSON.stringify(results)}`;
  }),
});

export type AppRouter = typeof appRouter;
