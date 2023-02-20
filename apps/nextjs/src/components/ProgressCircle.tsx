import React from "react";

type Props = {
  percentage: number;
  text?: string;
};

const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle = ({
  colour,
  percentage,
}: {
  colour: string;
  percentage: number;
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - percentage) * circumference) / 100;

  return (
    <circle
      r={radius}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokeDashoffset !== circumference ? colour : ""}
      strokeWidth={10}
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      stroke-linecap="round"
    />
  );
};

const ProgressCircle = ({ percentage, text }: Props) => {
  const pct = cleanPercentage(percentage);
  return (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <g transform="rotate(-90 100 100)">
        <Circle colour="#eaeaea" percentage={100} />
        <Circle colour="#ff0000" percentage={pct} />
      </g>
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={"1.5em"}
      >
        {text || `${pct.toFixed(0)}%`}
      </text>
    </svg>
  );
};

export default ProgressCircle;
