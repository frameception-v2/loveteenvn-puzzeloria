import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-gradient-to-br from-purple-600 to-indigo-600">
        <div tw="flex flex-col items-center bg-white/90 p-8 rounded-2xl shadow-2xl">
          <h1 tw="text-6xl font-bold text-purple-900 mb-4">{PROJECT_TITLE}</h1>
          <h3 tw="text-2xl text-purple-800 text-center max-w-[80%]">{PROJECT_DESCRIPTION}</h3>
          <div tw="mt-6 flex items-center">
            <div tw="text-xl text-purple-700 mr-2">Built with</div>
            <div tw="bg-purple-800 text-white px-3 py-1 rounded-full text-lg">Farcaster Frames</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
