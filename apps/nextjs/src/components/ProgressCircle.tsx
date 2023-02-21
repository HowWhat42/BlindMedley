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
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - percentage) * circumference) / 100;

  return (
    <circle
      r={radius}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokeDashoffset !== circumference ? colour : ""}
      strokeWidth={15}
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
    />
  );
};

const GradientCircle = ({ percentage }: { percentage: number }) => {
  const radius = 320;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - percentage) * circumference) / 100;

  return (
    <svg viewBox="0 0 800 800" opacity="1">
      <defs>
        <linearGradient
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="nnneon-grad"
          gradientTransform="rotate(27 0.5 0.5)"
        >
          <stop stopColor="#7D00FA" stopOpacity="1" offset="20%"></stop>
          <stop stopColor="#0094ff" stopOpacity="1" offset="100%"></stop>
        </linearGradient>
        <filter
          id="nnneon-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            stdDeviation="6 8"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          ></feGaussianBlur>
        </filter>
        <filter
          id="nnneon-filter2"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            stdDeviation="10 17"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          ></feGaussianBlur>
        </filter>
      </defs>
      <g strokeWidth="60" stroke="url(#nnneon-grad)" fill="none">
        <circle
          r={radius}
          cx="400"
          cy="400"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#nnneon-filter)"
        ></circle>
        <circle
          r={radius}
          cx="412"
          cy="400"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#nnneon-filter2)"
          opacity="0.25"
        ></circle>
        <circle
          r={radius}
          cx="388"
          cy="400"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#nnneon-filter2)"
          opacity="0.25"
        ></circle>
        <circle
          r={radius}
          cx="400"
          cy="400"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        ></circle>
      </g>
    </svg>
  );
};

const ProgressCircle = ({ percentage, text }: Props) => {
  const pct = cleanPercentage(percentage);
  return (
    <svg viewBox="0 0 200 200" width="286" height="286">
      <g transform="rotate(-90 100 100)">
        <Circle colour="#2b2b2b" percentage={100} />
        <GradientCircle percentage={pct} />
      </g>
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="#2b2b2b"
        fontWeight={"bold"}
        fontSize={"2.25em"}
      >
        {text || `${pct.toFixed(0)}%`}
      </text>
    </svg>
  );
};

export default ProgressCircle;
