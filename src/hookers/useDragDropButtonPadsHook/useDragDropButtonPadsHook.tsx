import * as React from "react";
import { DragAndDropDataTypes, DragAndDropOptions } from "../../types_";
import { useButtonPad, useStyle } from "..";

enum DragDropStates {
  DragStart = "dragstart",
  DragEnd = "dragend"
}

type TAllowDrop = (e: React.DragEvent<HTMLDivElement>) => void;
type TDragEnd = (e: React.DragEvent<HTMLDivElement>) => void;
type TDragOver = () => void;
type TDragStart = (e: React.DragEvent<HTMLDivElement>) => void;
type TItemDrop = (
  e: React.DragEvent<HTMLDivElement>,
  destinationPadNumber: number,
  destinationPadId: string | undefined
) => void;

interface IntUseDragDropHook {
  dragDropRef: any;
  isDragOver: boolean;
  allowDrop: TAllowDrop;
  itemDrop: TItemDrop;
  dragOver: TDragOver;
  dragLeave: TDragEnd;
}

const useDragDropButtonPadsHook = (
  buttonPadNumber: number
): IntUseDragDropHook => {
  const { applyStyle } = useStyle();
  const { overWriteButtonPads, swapButtonPads } = useButtonPad();
  const dragDropRef = React.useRef<any>(null);
  const [isDragOver, setIsdragOver] = React.useState<boolean>(false);

  React.useEffect(() => {
    const menuDragEnd: TDragEnd = e => {};

    const menuDragStart: TDragStart = e => {
      if (e?.dataTransfer?.setData) {
        const dndAction = e.ctrlKey
          ? DragAndDropOptions.CopyButtonPad
          : DragAndDropOptions.SwapButtonPad;

        e.dataTransfer.setData(DragAndDropDataTypes.Action, dndAction);

        e.dataTransfer.setData(
          DragAndDropDataTypes.OriginPadNumber,
          buttonPadNumber.toString()
        );
      }
    };

    let buttonPadRefCleanUp = dragDropRef.current;
    buttonPadRefCleanUp?.addEventListener(
      DragDropStates.DragStart,
      (e: React.DragEvent<HTMLDivElement>) => menuDragStart(e)
    );

    buttonPadRefCleanUp?.addEventListener(
      DragDropStates.DragEnd,
      (e: React.DragEvent<HTMLDivElement>) => menuDragEnd(e)
    );

    return () => {
      buttonPadRefCleanUp?.removeEventListener(
        DragDropStates.DragStart,
        (e: React.DragEvent<HTMLDivElement>) => menuDragStart(e)
      );

      buttonPadRefCleanUp?.removeEventListener(
        DragDropStates.DragEnd,
        (e: React.DragEvent<HTMLDivElement>) => menuDragEnd(e)
      );
      buttonPadRefCleanUp = null;
    };
    // eslint-disable-next-line
  }, [dragDropRef, buttonPadNumber]);

  const allowDrop: TAllowDrop = e => {
    e.preventDefault();
  };

  const itemDrop: TItemDrop = (e, destinationPadNumber, destinationPadId) => {
    const dndAction = e.dataTransfer.getData(DragAndDropDataTypes.Action);
    setIsdragOver(false);

    switch (dndAction) {
      case DragAndDropOptions.StyleButtonPad:
        applyStyle(
          e.dataTransfer.getData(DragAndDropDataTypes.StyleId),
          buttonPadNumber
        );
        break;

      case DragAndDropOptions.CopyButtonPad:
        if (!e.ctrlKey) return;
        const originPadNumberCopy = parseInt(
          e.dataTransfer.getData(DragAndDropDataTypes.OriginPadNumber)
        );

        if (originPadNumberCopy === destinationPadNumber) return;

        overWriteButtonPads(originPadNumberCopy, destinationPadNumber);
        break;

      case DragAndDropOptions.SwapButtonPad:
        const originPadNumberSwap = parseInt(
          e.dataTransfer.getData(DragAndDropDataTypes.OriginPadNumber)
        );

        if (originPadNumberSwap === destinationPadNumber) return;

        swapButtonPads(originPadNumberSwap, destinationPadNumber);
        break;

      default:
        break;
    }
  };

  const dragOver: TDragOver = () => {
    setIsdragOver(true);
  };

  const dragLeave: TDragEnd = () => {
    setIsdragOver(false);
  };

  return {
    allowDrop,
    dragDropRef,
    dragLeave,
    dragOver,
    isDragOver,
    itemDrop
  };
};

export default useDragDropButtonPadsHook;
