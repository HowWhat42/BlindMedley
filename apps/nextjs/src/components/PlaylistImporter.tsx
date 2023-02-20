import { useState } from "react";

import { api } from "~/utils/api";
import Song from "./Song";

interface song {
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  releaseDate: Date;
  url: string;
}

const PlaylistImporter = () => {
  const [songsList, setSongsList] = useState<song[]>([]);
  const getSpotifySongsList = api.spotify.songsList.useMutation();
  const getDeezerSongsList = api.deezer.songsList.useMutation();

  const getPlaylistId = (
    url: string,
  ): { id: string; provider: "spotify" | "deezer" } => {
    // https://open.spotify.com/playlist/3rsOyZnnXMBOiyBVVvpacn?si=2dd24a348c874630
    // https://www.deezer.com/en/playlist/1010101010
    if (url.includes("spotify") || url.includes("deezer")) {
      return {
        id: url.split("/playlist/")[1]?.split("?")[0]!,
        provider: url.includes("spotify") ? "spotify" : "deezer",
      };
    } else {
      return { id: url, provider: isNaN(parseInt(url)) ? "spotify" : "deezer" };
    }
  };

  const importPlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const playlistUrl = e.currentTarget.playlistUrl.value;
    const { id, provider } = getPlaylistId(playlistUrl);
    if (provider === "deezer") {
      const data = await getDeezerSongsList.mutateAsync(id);
      setSongsList(data);
      e.currentTarget.reset();
      return;
    } else {
      const data = await getSpotifySongsList.mutateAsync(id);
      setSongsList(data);
      e.currentTarget.reset();
      return;
    }
  };

  return (
    <div>
      <form onSubmit={importPlaylist}>
        <input type="text" name="playlistUrl" />
        <button type="submit">Import</button>
      </form>
      <div className="grid grid-cols-6 gap-4">
        {songsList.map((song, idx) => (
          <Song key={idx} song={song} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistImporter;
