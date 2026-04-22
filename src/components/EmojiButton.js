import { Button } from "@/components/Button";

export function EmojiButton({ symbol, counter, onClick }) {
  return (
    <div onClick={onClick} className=" p-1 w-fit">
      <Button variant="icon" className=" flex items-center gap-2">
        <span className="text-xl text-red-500">{symbol}</span>
        <span className="text-slate-600 font-bold">{counter}</span>
      </Button>
    </div>
  );
}
