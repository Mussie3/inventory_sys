import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Button } from "./button";

type PaidInPrice = {
  cash: number;
  credit: number;
  POS: number;
  transfer: number;
};

type Props = {
  type: "cash" | "credit" | "POS" | "transfer";
  state: PaidInPrice;
  setValue: Dispatch<SetStateAction<PaidInPrice>>;
  diff: number;
};

export default function InputWithCheck({ type, state, setValue, diff }: Props) {
  const [disabled, setDisabled] = useState(false);
  const [value, setvalue] = useState(state[type]);

  useEffect(() => {
    if (type == "cash") {
      setValue((pre) => {
        return {
          ...pre,
          cash: value,
        };
      });
    }
    if (type == "POS") {
      setValue((pre) => {
        return {
          ...pre,
          POS: value,
        };
      });
    }
    if (type == "transfer") {
      setValue((pre) => {
        return {
          ...pre,
          transfer: value,
        };
      });
    }
    if (type == "credit") {
      setValue((pre) => {
        return {
          ...pre,
          credit: value,
        };
      });
    }
  }, [value]);

  function addDeff() {
    if (type == "cash") {
      setValue((pre) => {
        return {
          ...pre,
          cash: pre.cash - diff,
        };
      });
    }
    if (type == "POS") {
      setValue((pre) => {
        return {
          ...pre,
          POS: pre.POS - diff,
        };
      });
    }
    if (type == "transfer") {
      setValue((pre) => {
        return {
          ...pre,
          transfer: pre.transfer - diff,
        };
      });
    }
    if (type == "credit") {
      setValue((pre) => {
        return {
          ...pre,
          credit: pre.credit - diff,
        };
      });
    }
  }

  return (
    <div className="flex items-center gap-8">
      <Checkbox
        id="Discount"
        checked={!disabled}
        onCheckedChange={() => setDisabled((pre) => !pre)}
      />
      <div className="flex gap-2 items-center group">
        <div className="w-20">{type} : </div>
        <Input
          id={type}
          type="number"
          placeholder={type}
          className="w-52"
          value={state[type]}
          onChange={(e) => setvalue(Number(e.target.value))}
        />
        {diff !== 0 && (
          <Button
            variant={"ghost"}
            onClick={addDeff}
            className={`hidden group-hover:block ${
              diff < 0 ? `text-green-400` : `text-red-400`
            }`}
          >
            {diff > 0
              ? `- ${diff.toLocaleString("en-US")} ETB`
              : `+ ${diff.toLocaleString("en-US")} ETB`}
          </Button>
        )}
      </div>
    </div>
  );
}
