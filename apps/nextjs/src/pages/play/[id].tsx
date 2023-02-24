import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { prisma } from "@acme/db";

import { levenshtein, textFormater } from "~/utils/formater";
import Song from "~/components/Song";
import Timer from "~/components/Timer";
import Back from "~/assets/img/back.svg";
import Check from "~/assets/img/check.svg";
import Cross from "~/assets/img/cross.svg";
import Speaker1 from "~/assets/img/speaker1.svg";
import Speaker2 from "~/assets/img/speaker2.svg";
import Speaker3 from "~/assets/img/speaker3.svg";
import Speaker from "~/assets/img/speaker.svg";

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
  const session = useSession().data;
  const router = useRouter();
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
  const [endOfPlaylist, setEndOfPlaylist] = useState<boolean>(false);

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

  const playPause = async () => {
    if (audio) {
      if (audio.paused) {
        await audio.play();
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
      setEnded(true);
      setTimeout(() => {
        nextTrack();
      }, 1000);
    }
  }, [artistFound, titleFound]);

  // Set next track after artist and title are found
  const nextTrack = () => {
    audio?.pause();
    setAudio(null);
    setArtistFound(false);
    setTitleFound(false);
    setEnded(false);
    if (currentTrackIndex < tracks.length - 1) {
      setPlayedTracks([currentTrack, ...playedTracks]);
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTrack(tracks[currentTrackIndex + 1]);
    } else {
      setEndOfPlaylist(true);
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
      if (artistLv < 3 && !artistFound) {
        if (audio.currentTime < 10) {
          multiplier = 2;
        } else if (audio.currentTime < 20) {
          multiplier = 1.5;
        }
        setScore(score + 10 * multiplier);
        setArtistFound(true);
      }
      if (titleLv < 3 && !titleFound) {
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

  const onBack = () => {
    audio?.pause();
    router.push("/");
  };

  const onReplay = () => {
    router.reload();
  };

  if (!playlist) {
    return <div>Loading</div>;
  }

  return (
    <div className="h-full min-h-screen bg-light bg-dots-pattern bg-no-repeat bg-cover">
      <div className="w-full flex justify-center items-center pt-6">
        <button onClick={onBack} className="absolute top-3 left-4">
          <Image src={Back} width={50} height={50} alt="back" />
        </button>
        <div>
          <h1 className="text-center text-grey text-xl font-normal">
            {playlist.name}
          </h1>
          <p className="text-center text-grey text-md font-light">
            {currentTrackIndex + 1} / {tracks.length}
          </p>
        </div>
      </div>
      {endOfPlaylist ? (
        <div className="flex flex-col mt-10 items-center">
          <div className="bg-grey flex flex-col items-center justify-center rounded-3xl">
            <p className="pt-6 text-light text-2xl font-bold">Ton score</p>
            <p className="py-4 px-20 bg-gradient-to-br from-purple-light via-purple to-blue text-transparent bg-clip-text font-notmal text-[80px]">
              {score} {score < 2 ? "pt" : "pts"}
            </p>
            <p className="pb-6 text-light text-sm">Meilleur score: ???pts</p>
          </div>
          <button
            className="bg-purple text-lg text-light hover:bg-purple-light rounded-2xl my-5 py-3 px-20 transition-all duration-300"
            onClick={onReplay}
          >
            Rejouer
          </button>
          <div className="px-4">
            <h2 className="font-bold text-lg text-grey">
              Musiques précédentes :
            </h2>
            <div className="flex flex-col justify-center">
              {playedTracks.map((track, idx) => (
                <Song inline song={track} key={idx} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        currentTrack && (
          <div className="flex flex-col items-center">
            <div>
              <div className="flex flex-col items-center">
                {ended ? (
                  <Song song={currentTrack} />
                ) : (
                  audio && <Timer audio={audio} />
                )}
                <div className="bg-grey flex items-center justify-center rounded-3xl">
                  <p className="py-4 px-16 bg-gradient-to-br from-purple-light via-purple to-blue text-transparent bg-clip-text font-bold text-xl">
                    {score} {score < 2 ? "pt" : "pts"}
                  </p>
                </div>
              </div>
              <div className="flex mt-4 justify-between">
                <div className="flex items-center">
                  <p className="text-grey">Artiste</p>
                  <Image
                    src={artistFound ? Check : Cross}
                    width={32}
                    height={32}
                    alt="artist"
                  />
                </div>
                <div className="flex items-center">
                  <p className="text-grey">Titre</p>
                  <Image
                    src={titleFound ? Check : Cross}
                    width={32}
                    height={32}
                    alt="title"
                  />
                </div>
              </div>
              <form onSubmit={onSubmit} className="flex flex-col my-6">
                <label htmlFor="answer" className="text-lg text-grey mb-2">
                  Titre / Artiste
                </label>
                <input
                  name="answer"
                  type="text"
                  autoComplete="off"
                  className="bg-purple-light text-grey placeholder-grey rounded-2xl py-3 px-4 mb-4"
                  placeholder="Réponse"
                />
                <button className="bg-purple text-lg text-light hover:bg-purple-light rounded-2xl py-3 px-4 transition-all duration-300">
                  Valider
                </button>
              </form>
            </div>
            {session?.user.role === "ADMIN" && (
              <button onClick={playPause}>Play</button>
            )}
            <div>
              <div className="flex mt-6 gap-2">
                <Image
                  src={
                    volume === 0
                      ? Speaker
                      : volume < 0.25
                      ? Speaker1
                      : volume < 0.75
                      ? Speaker2
                      : Speaker3
                  }
                  alt="speaker"
                  width={40}
                  height={40}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={volume * 100}
                  onChange={changeVolume}
                />
              </div>
            </div>
            {playedTracks.length > 0 && (
              <div className="px-4">
                <h2 className="font-bold text-lg text-grey">
                  Musiques précédentes :
                </h2>
                <div className="flex flex-col">
                  {playedTracks.map((track, idx) => (
                    <Song inline song={track} key={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
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
