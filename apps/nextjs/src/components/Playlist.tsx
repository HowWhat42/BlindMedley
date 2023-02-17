import React from "react";
import Link from "next/link";

type Props = {
  playlist: {
    id: string;
    name: string;
    author: string;
    thumbnail: string;
  };
};

const Playlist = ({ playlist }: Props) => {
  return (
    <Link href={`/playlists/${playlist.id}`}>
      <img src={playlist.thumbnail} alt={playlist.name} />
      <h3>{playlist.name}</h3>
      <h4>{playlist.author}</h4>
    </Link>
  );
};

export default Playlist;
