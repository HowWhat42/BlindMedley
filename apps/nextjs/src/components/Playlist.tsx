import React from "react";
import Image from "next/image";
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
      <Image src={playlist.thumbnail} alt={playlist.name} />
      <h3>{playlist.name}</h3>
      <h4>{playlist.author}</h4>
    </Link>
  );
};

export default Playlist;
