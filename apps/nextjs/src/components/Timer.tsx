import { useEffect, useState } from "react";

import ProgressCircle from "./ProgressCircle";

type Props = {
  audio: HTMLAudioElement;
};

const Timer = ({ audio }: Props) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (audio) {
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
    }
  }, [audio]);

  return (
    <div>
      <ProgressCircle
        text={`${audio.currentTime.toFixed(0)}s`}
        percentage={(currentTime / audio.duration) * 100}
      />
    </div>
  );
};

export default Timer;
