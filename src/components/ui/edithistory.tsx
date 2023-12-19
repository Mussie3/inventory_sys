import { FiEdit } from "react-icons/fi";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Log = { addedAmount: number; datetime: string };

type Props = {
  his: Log;
  func: any;
  index: number;
};

export default function EditHistory({ his, func, index }: Props) {
  const [edit, setEdit] = useState(false);
  const [value, setvalue] = useState(his.addedAmount);
  useEffect(() => {
    func((pre: Log[]) => {
      return pre.map((g, i) => {
        if (i == index) {
          return { ...g, addedAmount: Number(value) };
        }
        return g;
      });
    });
  }, [value, func, index]);
  return (
    <Card className="mb-4">
      <CardContent className="flex p-4 gap-4">
        <div className="flex flex-wrap w-full items-center justify-between">
          {edit ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex w-fit items-center gap-2">
                <div className="w-fit">Amount:</div>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setvalue(Number(e.target.value))}
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setEdit((pre) => !pre)}
              >
                submit
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap w-full items-center justify-between">
              <div className="flex gap-2">
                <span className="bg-gray-400 p-1 rounded">Amount Added:</span>
                <div className="text-xl">{` ${value}`}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">Date:</span>
                  {` ${new Date(his.datetime).toUTCString()}`}
                </div>
                <Button variant="ghost" onClick={() => setEdit((pre) => !pre)}>
                  <FiEdit size={20} color="green" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
