import { useEffect, useState } from "react";
import Link from "next/link";
import { prisma } from "@acme/db";

import { levenshtein, textFormater } from "~/utils/formater";
import Song from "~/components/Song";

type Props = {
  playlist: {
    id: string;
    name: string;
    author: string;
    thumbnail: string;
    tracks: {
      title: string;
      artist: string;
      album: string;
      thumbnail: string;
      releaseDate: Date;
      url: string;
    }[];
  };
};

const PlayPage = ({ playlist }: Props) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [artistFound, setArtistFound] = useState<boolean>(false);
  const [titleFound, setTitleFound] = useState<boolean>(false);

  if (!playlist) {
    return <div>Loading</div>;
  }

  const shuffle = (array: any[]) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  useEffect(() => {
    setTracks(shuffle(playlist.tracks).slice(0, 10));
  }, []);

  useEffect(() => {
    setCurrentTrack(tracks[0]);
  }, [tracks]);

  const nextTrack = () => {
    setArtistFound(false);
    setTitleFound(false);
    const nextTrack = tracks[1];
    setCurrentTrack(nextTrack);
    setTracks(tracks.slice(1));
  };

  if (artistFound && titleFound) {
    nextTrack();
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const artist = textFormater(currentTrack?.artist);
    const title = textFormater(currentTrack?.title);

    const answer = textFormater(e.currentTarget.answer.value);
    if (answer === "") return;
    const artistLv = levenshtein(artist, answer)!;
    const titleLv = levenshtein(title, answer)!;
    console.log(artistLv, titleLv);
    console.log(artistFound, titleFound);
    if (artistLv < 3) {
      setArtistFound(true);
    }
    if (titleLv < 3) {
      setTitleFound(true);
    }
    // TODO If correct, go to next song
    // TODO If incorrect, show error
    console.log(artist, title, answer);

    e.currentTarget.answer.value = "";
  };

  const onEnd = () => {
    nextTrack();
  };

  return (
    <div className="h-screen bg-light">
      <Link href={"/"}>
        <h2>Back</h2>
      </Link>
      <h1>{playlist.name}</h1>
      <h2>{playlist.author}</h2>
      {/* <div className="grid grid-cols-5 gap-4">
        {tracks.map((track, idx) => (
          <Song song={track} key={idx} />
        ))}
      </div> */}
      <div>
        <form onSubmit={onSubmit}>
          <audio src={currentTrack?.url} controls autoPlay onEnded={onEnd} />
          <input name="answer" type="text" />
          <button>Submit</button>
        </form>
      </div>
      <div>
        <p>Artist : {artistFound ? "Trouvé" : "Pas encore"}</p>
        <p>Title : {titleFound ? "Trouvé" : "Pas encore"}</p>
      </div>
    </div>
  );
};

export default PlayPage;

export const getServerSideProps = async ({ params }: any) => {
  const { id } = params;
  let playlist = await prisma.playlist.findUnique({
    where: { id },
    include: { tracks: true },
  });

  playlist = JSON.parse(JSON.stringify(playlist));

  return {
    props: {
      playlist,
    },
  };
};
