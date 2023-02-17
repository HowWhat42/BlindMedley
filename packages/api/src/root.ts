import { authRouter } from "./router/auth";
import { deezerRouter } from "./router/deezer";
import { playlistRouter } from "./router/playlists";
import { spotifyRouter } from "./router/spotify";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  spotify: spotifyRouter,
  deezer: deezerRouter,
  playlists: playlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
