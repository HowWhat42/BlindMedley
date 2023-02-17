import React from "react";

type Props = {
  song: {
    title: string;
    artist: string;
    album: string;
    thumbnail: string;
    releaseDate: Date;
    url: string;
  };
};

const Song = ({ song }: Props) => {
  return (
    <div>
      <img src={song.thumbnail} alt={song.title} />
      <h3>{song.title}</h3>
      <h4>{song.artist}</h4>
      <h5>{song.album}</h5>
      {/* <h6>{new Date(song.releaseDate).toDateString()}</h6> */}
      <audio className="w-48" src={song.url} controls />
    </div>
  );
};

export default Song;
