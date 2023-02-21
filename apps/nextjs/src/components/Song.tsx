import React from "react";
import Image from "next/image";

type Props = {
  song: {
    title: string;
    artist: string;
    album: string;
    thumbnail: string;
    releaseDate: Date;
    url: string;
  };
  inline?: boolean;
};

const Song = ({ song, inline }: Props) => {
  // Format the date with Intl.DateTimeFormat
  const date = new Date(song.releaseDate).getFullYear();

  return (
    <div
      className={`flex ${
        !inline && "flex-col"
      } justify-center items-center text-grey mb-4`}
    >
      <Image
        src={song.thumbnail}
        alt={song.title}
        className="my-2"
        width={inline ? 80 : 200}
        height={inline ? 80 : 200}
      />
      <div className="flex flex-col ml-4">
        <h3 className="text-lg font-bold">{song.title}</h3>
        <h4 className="text-md font-bold">{song.artist}</h4>
        <h5 className="text-sm">
          Album : {song.album} / {date}
        </h5>
      </div>
    </div>
  );
};

export default Song;
