import React from "react";
import { signIn, signOut } from "next-auth/react";

import { api } from "~/utils/api";

type Props = {};

const Auth = (props: Props) => {
  const { data: session } = api.auth.getSession.useQuery();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="bg-purple text-lg text-light hover:bg-purple-light rounded-2xl py-3 px-4 transition-all duration-300"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Se déconnecter" : "Se connecter"}
      </button>
    </div>
  );
};

export default Auth;
