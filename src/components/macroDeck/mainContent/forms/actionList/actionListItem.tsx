import React from "react";
import * as Styled from "./actionList.styles";
import { Trash2Fill } from "react-bootstrap-icons";

import {
  useAction,
  useActive,
  useDragDropActions
} from "../../../../../hookers";

import SubActionParser from "./subActionParser/subActionParser";
import { Action } from "../../../../../types_";

interface IActionListItem {
  action: Action;
}

const ActionListItem: React.FC<IActionListItem> = ({ action }) => {
  const { action: activeAction } = useActive();
  const { activateAction, deleteAction, readActions } = useAction();
  const { allowDrop, itemDrop, dragDropRef } = useDragDropActions(action._id);

  const handleSelectActionSet = (_id: string): void => {
    activateAction(_id);
  };

  const handleDeleteAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    _id: string
  ): void => {
    e.stopPropagation();
    deleteAction(_id);
  };

  return (
    <Styled.ActionListItem
      data-testid="action-list__action-item-activate"
      draggable={true}
      isActive={action._id === activeAction?._id}
      key={action._id}
      onClick={() => handleSelectActionSet(action._id)}
      onDragOver={allowDrop}
      onDrop={e => itemDrop(e, action._id)}
      ref={dragDropRef}
    >
      <SubActionParser action={action} />

      {readActions && readActions.length > 1 ? (
        <Styled.ActionListItemButton
          data-testid="action-list__action-item-delete"
          onClick={(e: any) => handleDeleteAction(e, action._id)}
        >
          <Trash2Fill size={16} />
        </Styled.ActionListItemButton>
      ) : null}
    </Styled.ActionListItem>
  );
};

export default ActionListItem;
