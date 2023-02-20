import { use, useEffect, useState } from "react";
import Link from "next/link";
import { prisma } from "@acme/db";

import { levenshtein, textFormater } from "~/utils/formater";
import Song from "~/components/Song";
import Timer from "~/components/Timer";

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

interface song {
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  releaseDate: Date;
  url: string;
}

const PlayPage = ({ playlist }: Props) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [artistFound, setArtistFound] = useState<boolean>(false);
  const [titleFound, setTitleFound] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.1);
  const [ended, setEnded] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [playedTracks, setPlayedTracks] = useState<song[] | []>([]);

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

  // Set tracks after playlist is set
  useEffect(() => {
    setTracks(shuffle(playlist.tracks).slice(0, 10));
  }, [playlist]);

  // Set current track after tracks are set
  useEffect(() => {
    if (currentTrack) {
      audio?.pause();
    }
    setCurrentTrack(tracks[currentTrackIndex]);
  }, [tracks]);

  // Set audio after current track is set
  useEffect(() => {
    if (currentTrack) {
      const audio = new Audio(currentTrack.url);
      setAudio(audio);
      audio.volume = volume;
      audio.play();

      audio.addEventListener("ended", () => {
        setEnded(true);
        setTimeout(() => {
          nextTrack();
        }, 5000);
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    if (artistFound && titleFound) {
      nextTrack();
    }
  }, [artistFound, titleFound]);

  // Set next track after artist and title are found
  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      audio?.pause();
      setAudio(null);
      setPlayedTracks([...playedTracks, currentTrack]);
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTrack(tracks[currentTrackIndex + 1]);
      setArtistFound(false);
      setTitleFound(false);
      setEnded(false);
    } else {
      // TODO End of playlist
      console.log("End of playlist");
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (audio) {
      const artist = textFormater(currentTrack?.artist);
      const title = textFormater(currentTrack?.title);
      let multiplier = 1;

      const answer = textFormater(e.currentTarget.answer.value);
      if (answer === "") return;
      const artistLv = levenshtein(artist, answer)!;
      const titleLv = levenshtein(title, answer)!;
      if (artistLv < 3) {
        if (audio.currentTime < 10) {
          multiplier = 2;
        } else if (audio.currentTime < 20) {
          multiplier = 1.5;
        }
        setScore(score + 10 * multiplier);
        setArtistFound(true);
      }
      if (titleLv < 3) {
        if (audio.currentTime < 10) {
          multiplier = 2;
        } else if (audio.currentTime < 20) {
          multiplier = 1.5;
        }
        setScore(score + 10 * multiplier);
        setTitleFound(true);
      }
      // TODO If incorrect, show error
      console.log(artist, title, answer);
    }
    e.currentTarget.answer.value = "";
  };

  const playPause = () => {
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      audio.volume = Number(e.currentTarget.value) / 100;
      setVolume(Number(e.currentTarget.value) / 100);
    }
  };

  return (
    <div className="h-screen bg-light">
      <Link href={"/"}>
        <h2>Back</h2>
      </Link>
      <h1>{playlist.name}</h1>
      <h2>{playlist.author}</h2>
      {currentTrack && (
        <div className="flex flex-col items-center">
          <div>
            {audio && (
              <div>
                <Timer audio={audio} />
                <button onClick={playPause}>Play</button>
                <p>Volume : </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={volume * 100}
                  onChange={changeVolume}
                />
              </div>
            )}
            <form onSubmit={onSubmit}>
              <input name="answer" type="text" />
              <button>Valider</button>
            </form>
          </div>
          <div>
            <p>Score : {score}</p>
            <p>
              Musique : {currentTrackIndex + 1} / {tracks.length}
            </p>
            <p>Artist : {artistFound ? "Trouvé" : "Pas encore"}</p>
            <p>Title : {titleFound ? "Trouvé" : "Pas encore"}</p>
          </div>
          {ended && (
            <div className="w-48">
              <Song song={currentTrack} />
            </div>
          )}
          {playedTracks.length > 0 && (
            <div className="flex flex-col items-center">
              <h2>Played tracks</h2>
              <div className="flex flex-wrap justify-center">
                {playedTracks.map((track) => (
                  <div className="w-48">
                    <Song song={track} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
