import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

const PlaylistPage = () => {
  const router = useRouter();
  const playlistId = router.query.id as string;
  const { data: playlist } = api.playlists.byId.useQuery(playlistId);
  const deletePlaylist = api.playlists.delete.useMutation();

  const onDelete = async () => {
    try {
      await deletePlaylist.mutateAsync(playlistId);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const onPlay = () => {
    router.push(`/play/${playlistId}`);
  };

  return (
    <div className="bg-light h-screen">
      <Link href={"/"}>
        <h2>Back</h2>
      </Link>
      {playlist ? (
        <div>
          <Image
            src={playlist.thumbnail}
            alt={playlist.name}
            width={300}
            height={300}
          />
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
