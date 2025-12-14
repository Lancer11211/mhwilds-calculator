import { useMemo } from "react";
import { round } from "@/model";
import { useComputed } from "@/store/builder";
import { useCombo } from "@/store/combo";
import { Table, TableCell, TableHeadRow, TableRow } from "./Table";

export const ComboTable = ({ disabled }: { disabled?: boolean }) => {
  const { mode, dynamic, snapshot, removeDynamic, removeSnapshot } = useCombo();
  const { calculateAtk } = useComputed();

  const dynamicWithDamage = useMemo(() => {
    return dynamic.map(({ count, ...a }, i) => ({
      ...a,
      count,
      index: i,
      ...calculateAtk(a),
    }));
  }, [dynamic, calculateAtk]);

  return (
    <Table>
      <thead>
        <TableHeadRow>
          <TableCell small className="w-full"></TableCell>
          <TableCell small className="text-right">
            Hit
          </TableCell>
          <TableCell small className="text-right">
            Crit
          </TableCell>
          <TableCell small className="text-right">
            Avg
          </TableCell>
        </TableHeadRow>
      </thead>
      <tbody>
        {mode === "Dynamic" &&
          dynamicWithDamage.map((a) => {
            return (
              <TableRow
                key={`${a.name}-${a.index}`}
                onClick={disabled ? undefined : () => removeDynamic(a.index)}
              >
                <TableCell small className="w-full text-left">
                  {a.name}
                  {a.count > 1 && ` x${a.count}`}
                </TableCell>
                <TableCell small className="text-right">
                  {round(a.hit * a.count)}
                </TableCell>
                <TableCell small className="text-right">
                  {!a.cantCrit && round(a.crit * a.count)}
                </TableCell>
                <TableCell
                  small
                  className="text-primary text-right font-medium"
                >
                  {round(a.avg * a.count, 2)}
                </TableCell>
              </TableRow>
            );
          })}
        {mode === "Snapshot" &&
          snapshot.map((a, i) => {
            return (
              <TableRow
                key={`${a.name}-${i}`}
                onClick={disabled ? undefined : () => removeSnapshot(i)}
              >
                <TableCell small className="w-full text-left">
                  {a.name}
                  {a.count > 1 && ` x${a.count}`}
                </TableCell>
                <TableCell small className="text-right">
                  {a.hit}
                </TableCell>
                <TableCell small className="text-right">
                  {!a.cantCrit && a.crit}
                </TableCell>
                <TableCell
                  small
                  className="text-primary text-right font-medium"
                >
                  {a.avg}
                </TableCell>
              </TableRow>
            );
          })}
      </tbody>
    </Table>
  );
};
