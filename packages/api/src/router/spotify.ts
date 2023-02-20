import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const authenticate = async () => {
  const { body } = await spotifyApi.clientCredentialsGrant();
  console.log("The access token expires in " + body["expires_in"]);
  console.log("The access token is " + body["access_token"]);

  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(body["access_token"]);
};

export const spotifyRouter = createTRPCRouter({
  songsList: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await authenticate();
      const { body }: any = await spotifyApi.getPlaylist(input);
      const playlist = await ctx.prisma.playlist.create({
        data: {
          name: body.name,
          author: body.owner.display_name,
          thumbnail: body.images[0].url,
        },
      });
      // Parse the response body to get the tracks
      const tracks = body.tracks.items.map(async (item: any) => {
        let previewUrl: string = item.track.preview_url;
        if (!item.track.preview_url) {
          // Call Deezer API to get the preview URL
          // https://api.deezer.com/search/track?q=
          const title = item.track.name.split(" - ")[0];
          const urlEncodedName = encodeURIComponent(title);
          const deezerResponse = await axios.get(
            `https://api.deezer.com/search/track?q=${urlEncodedName}`,
          );
          const deezerTracks = deezerResponse.data.data;
          const track = deezerTracks[0];
          if (track) {
            previewUrl = track.preview;
          }
        }
        if (!previewUrl) {
          return null;
        }
        // Create the track in the database or update playlist
        return ctx.prisma.track.upsert({
          where: {
            url: previewUrl,
          },
          update: {
            playlists: {
              connect: {
                id: playlist.id,
              },
            },
          },
          create: {
            title: item.track.name,
            artist: item.track.artists[0].name,
            album: item.track.album.name,
            releaseDate: new Date(item.track.album.release_date),
            thumbnail: item.track.album.images[0].url,
            url: previewUrl,
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
