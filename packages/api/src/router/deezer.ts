import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const deezerRouter = createTRPCRouter({
  songsList: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { data } = await axios.get(
        `https://api.deezer.com/playlist/${input}`,
      );
      const playlist = await ctx.prisma.playlist.create({
        data: {
          name: data.title,
          author: data.creator.name,
          thumbnail: data.picture_medium,
        },
      });
      // Parse the response body to get the tracks
      const tracks = data.tracks.data.map(async (item: any) => {
        const { data: deezerTrack } = await axios.get(
          `https://api.deezer.com/track/${item.id}`,
        );
        const release_date = new Date(deezerTrack.album.release_date);
        // Create the track in the database or update playlist
        if (!item.preview) {
          return null;
        }
        return ctx.prisma.track.upsert({
          where: {
            url: item.preview,
          },
          update: {
            playlists: {
              connect: {
                id: playlist.id,
              },
            },
          },
          create: {
            title: item.title,
            artist: item.artist.name,
            album: item.album.title,
            releaseDate: release_date,
            thumbnail: item.album.cover_medium,
            url: item.preview,
            playlists: {
              connect: {
                id: playlist.id,
              },
            },
          },
        });
      });

      return Promise.all(tracks);
    }),
});
