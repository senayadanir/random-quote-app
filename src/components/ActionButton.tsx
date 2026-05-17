import { ReactNode } from "react";
import { Button } from "./ui/button";

export interface ActionButtonInterface {
  symbol: ReactNode,
  counter: number,
  onClick: () => void;  
}

export function ActionButton({ symbol, counter, onClick }: ActionButtonInterface) {
  return (
    <div onClick={onClick} className=" p-1 w-fit">
      <Button
        variant="outline"
        className="border-none text-slate-600 bg-transparent hover:bg-chart-3 hover:text-white hover:border flex items-center gap-2"
      >
        <span className="text-xl text-red-400">{symbol}</span>
        {counter >= 0 && <span className=" font-bold ">{counter}</span>}
      </Button>
    </div>
  );
}
