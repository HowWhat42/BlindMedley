import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Back from "~/assets/img/back.svg";

const PlaylistPage = () => {
  const session = useSession().data;
  const router = useRouter();
  const playlistId = router.query.id as string;
  const { data: playlist } = api.playlists.byId.useQuery(playlistId);
  const deletePlaylist = api.playlists.delete.useMutation();

  const onDelete = async () => {
    try {
      if (window.confirm("Voulez-vous vraiment supprimer cette playlist ?")) {
        await deletePlaylist.mutateAsync(playlistId);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPlay = () => {
    router.push(`/play/${playlistId}`);
  };

  return (
    <div className="bg-light h-screen bg-dots-pattern bg-no-repeat bg-cover">
      <Link href={"/"} className="absolute top-3 left-4">
        <Image src={Back} width={50} height={50} alt="back" />
      </Link>
      {playlist ? (
        <div className="flex flex-col items-center justify-center pt-6">
          <h1 className="text-center text-grey text-xl font-normal">
            {playlist.name}
          </h1>
          <h2 className="text-center text-grey text-md font-light">
            {playlist.author}
          </h2>
          <Image
            src={playlist.thumbnail}
            alt={playlist.name}
            className="rounded-2xl my-4"
            width={300}
            height={300}
          />
          <div className="flex gap-4">
            {session?.user.role === "ADMIN" && (
              <button
                onClick={onDelete}
                className="border-purple border-2 text-lg text-purple hover:border-red-500 hover:bg-red-500 hover:text-light rounded-2xl py-3 px-4 transition-all duration-300"
              >
                Supprimer
              </button>
            )}
            <button
              onClick={onPlay}
              className="bg-purple text-lg text-light hover:bg-purple-light rounded-2xl py-3 px-4 transition-all duration-300"
            >
              Jouer
            </button>
          </div>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default PlaylistPage;
