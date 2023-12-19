import { FiEdit } from "react-icons/fi";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type cat = {
  datetime: string;
  catagoryName: string;
  docId: string;
};

type Props = {
  cat: cat;
  func: any;
  catId: string;
};

export default function EditCat({ cat, func, catId }: Props) {
  const [edit, setEdit] = useState(false);
  const [value, setvalue] = useState(cat.catagoryName);

  useEffect(() => {
    func((pre: cat[]) => {
      return pre.map((g) => {
        if (g.docId == catId) {
          return { ...g, catagoryName: value };
        }
        return g;
      });
    });
  }, [value, func, catId]);

  return (
    <Card className="mb-4">
      <CardContent className="flex p-4 gap-4">
        <div className="flex flex-wrap w-full items-center justify-between">
          {edit ? (
            <div className="flex flex-wrap items-center justify-between w-full gap-8">
              <div className="flex w-fit items-center gap-2">
                <div className="w-fit">Amount:</div>
                <Input
                  value={value}
                  onChange={(e) => setvalue(e.target.value)}
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
            <div className="flex flex-wrap w-full items-center justify-between gap-8">
              <div className="flex gap-2">
                <span className="bg-gray-400 p-1 rounded">Catagory Name:</span>
                <div className="text-xl">{` ${value}`}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">Date:</span>
                  {` ${new Date(cat.datetime).toUTCString()}`}
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
