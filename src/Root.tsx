import React from "react";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { SocialReel } from "./SocialReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 Social Media Reel — 15 seconds @ 30 fps */}
      <Composition
        id="SocialReel"
        component={SocialReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Original hello-world */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor: "#00bfff",
        }}
      />
    </>
  );
};
