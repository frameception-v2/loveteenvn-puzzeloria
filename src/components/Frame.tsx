"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function PuzzleGame() {
  const [tiles, setTiles] = useState<number[]>(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 0]));
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const handleClick = (index: number) => {
    if (isSolved) return;
    
    const emptyIndex = tiles.indexOf(0);
    const clickedTile = tiles[index];
    
    // Check if clicked tile is adjacent to empty space
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = clickedTile;
      newTiles[index] = 0;
      setTiles(newTiles);
      setMoves(moves + 1);
      
      // Check if puzzle is solved
      if (newTiles.slice(0, 8).every((val, i) => val === i + 1)) {
        setIsSolved(true);
      }
    }
  };

  const resetGame = () => {
    setTiles(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    setMoves(0);
    setIsSolved(false);
  };

  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Puzzeloria</CardTitle>
        <CardDescription className="text-neutral-600">
          Slide the tiles to solve the puzzle!
        </CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-800">
        <div className="grid grid-cols-3 gap-1 w-[150px] mx-auto">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-10 h-10 flex items-center justify-center 
                ${tile === 0 ? 'bg-transparent' : 'bg-purple-500 hover:bg-purple-600'} 
                text-white font-bold rounded-md transition-colors`}
              disabled={tile === 0}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-neutral-600">Moves: {moves}</p>
          {isSolved && (
            <div className="mt-2">
              <p className="text-green-600 font-bold">You solved it!</p>
              <PurpleButton onClick={resetGame} className="mt-2">
                Play Again
              </PurpleButton>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        <PuzzleGame />
      </div>
    </div>
  );
}
