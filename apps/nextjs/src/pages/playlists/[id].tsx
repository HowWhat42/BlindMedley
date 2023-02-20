import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

type Props = {};

const PlaylistPage = ({}: Props) => {
  const router = useRouter();
  const playlistId = router.query.id as string;
  const { data: playlist } = api.playlists.byId.useQuery(playlistId);
  const deletePlaylist = api.playlists.delete.useMutation();

  const onDelete = async () => {
    await deletePlaylist.mutateAsync(playlistId);
    router.push("/");
  };

  const onPlay = () => {
    router.push(`/play/${playlistId}`);
  };

  return (
    <div className="bg-light">
      <Link href={"/"}>
        <h2>Back</h2>
      </Link>
      {playlist ? (
        <div>
          <img src={playlist.thumbnail} alt={playlist.name} />
          <h1>{playlist.name}</h1>
          <h2>{playlist.author}</h2>
          <button onClick={onDelete}>Delete</button>
          <button onClick={onPlay}>Play</button>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default PlaylistPage;
