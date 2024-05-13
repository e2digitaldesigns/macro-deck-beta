import React from "react";
import * as Styled from "./../breadCrumbMenu.style";
import _map from "lodash/map";
import { BreadCrumbMenuTypes, Action } from "../../../../../types_";
import { BreadCrumbMenuCloseButton } from "../closeButton";

import SubActionParser from "../../../mainContent/forms/actionList/subActionParser/subActionParser";

import { useActive, useAction } from "../../../../../hookers";

interface IBreadCrumbMenuActions {
  dropDownType: BreadCrumbMenuTypes;
  handleCloseMenu: () => void;
}

export const BreadCrumbMenuActions: React.FC<IBreadCrumbMenuActions> = ({
  dropDownType,
  handleCloseMenu
}) => {
  const { action: activeAction } = useActive();
  const { activateAction, readActions } = useAction();

  const handleActivateButtonPad = (_id: string): void => {
    activateAction(_id);
    // handleCloseMenu();
  };

  return dropDownType === BreadCrumbMenuTypes.Action &&
    readActions.length > 1 ? (
    <Styled.BreadCrumbMenu>
      {_map(readActions, (action: Action) => (
        <Styled.BreadCrumbMenuItem
          active={action._id === activeAction._id}
          key={action._id}
          onClick={() => handleActivateButtonPad(action._id)}
        >
          <SubActionParser action={action} />
        </Styled.BreadCrumbMenuItem>
      ))}

      <BreadCrumbMenuCloseButton handleCloseMenu={handleCloseMenu} />
    </Styled.BreadCrumbMenu>
  ) : null;
};
