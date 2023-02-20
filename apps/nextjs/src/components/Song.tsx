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
      <h3>Titre : {song.title}</h3>
      <h4>Artiste : {song.artist}</h4>
      <h5>Album : {song.album}</h5>
      {/* <h6>{new Date(song.releaseDate).toDateString()}</h6> */}
    </div>
  );
};

export default Song;
