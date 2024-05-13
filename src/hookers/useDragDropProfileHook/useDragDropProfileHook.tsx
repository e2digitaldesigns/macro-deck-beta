import * as React from "react";
import { useProfile } from "..";

enum DragDropStates {
  DragStart = "dragstart",
  DragEnd = "dragend"
}

enum DragDropDataKeys {
  Action = "dndAction",
  DragId = "dragId"
}

enum DragDropDataValues {
  Profile = "Profile"
}

type TAllowDrop = (e: React.DragEvent<HTMLDivElement>) => void;
type TDragEnd = (e: React.DragEvent<HTMLDivElement>) => void;
type TDragStart = (e: React.DragEvent<HTMLDivElement>, _id: string) => void;
type TItemDrop = (e: React.DragEvent<HTMLDivElement>, _id: string) => void;

interface IntUseDragDropHook {
  dragDropRef: any;
  allowDrop: TAllowDrop;
  itemDrop: TItemDrop;
}

const useDragDropHook = (draggingId: string): IntUseDragDropHook => {
  const { reOrderRofiles } = useProfile();
  const dragDropRef = React.useRef<any>(null);

  React.useEffect(() => {
    let buttonPadRefCleanUp = dragDropRef.current;

    const dragStart: TDragStart = (e, _id) => {
      e.dataTransfer.setData(DragDropDataKeys.DragId, _id);
      e.dataTransfer.setData(
        DragDropDataKeys.Action,
        DragDropDataValues.Profile
      );
    };

    const dragEnd: TDragEnd = e => {};

    buttonPadRefCleanUp.addEventListener(
      DragDropStates.DragStart,
      (e: React.DragEvent<HTMLDivElement>) => dragStart(e, draggingId)
    );

    buttonPadRefCleanUp.addEventListener(
      DragDropStates.DragEnd,
      (e: React.DragEvent<HTMLDivElement>) => dragEnd(e)
    );

    return () => {
      buttonPadRefCleanUp.removeEventListener(
        DragDropStates.DragStart,
        (e: React.DragEvent<HTMLDivElement>) => dragStart(e, draggingId)
      );

      buttonPadRefCleanUp.removeEventListener(
        DragDropStates.DragEnd,
        (e: React.DragEvent<HTMLDivElement>) => dragEnd(e)
      );

      buttonPadRefCleanUp = null;
    };
  }, [dragDropRef, draggingId]);

  const allowDrop: TAllowDrop = e => {
    e.preventDefault();
  };

  const itemDrop: TItemDrop = (e, dropId) => {
    const dragId = e.dataTransfer.getData(DragDropDataKeys.DragId);
    const action = e.dataTransfer.getData(DragDropDataKeys.Action);

    if (action !== DragDropDataValues.Profile) return;
    if (dragId === dropId) return;

    reOrderRofiles(dragId, dropId);
  };

  return {
    dragDropRef,
    allowDrop,
    itemDrop
  };
};

export default useDragDropHook;
