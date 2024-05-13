import React from "react";
import * as Styled from "./../breadCrumbMenu.style";
import _map from "lodash/map";
import { BreadCrumbMenuTypes, ButtonPad } from "../../../../../types_";
import { BreadCrumbMenuCloseButton } from "../closeButton";

import { useActive, useButtonPad } from "../../../../../hookers";

interface IBreadCrumbMenuButtonPads {
  dropDownType: BreadCrumbMenuTypes;
  handleCloseMenu: () => void;
}

export const BreadCrumbMenuButtonPads: React.FC<IBreadCrumbMenuButtonPads> = ({
  dropDownType,
  handleCloseMenu
}) => {
  const { buttonPad } = useActive();
  const { activateButtonPad, readButtonPads } = useButtonPad();

  const handleActivateButtonPad = (_id: string): void => {
    activateButtonPad(_id);
    handleCloseMenu();
  };

  return dropDownType === BreadCrumbMenuTypes.ButtonPad &&
    readButtonPads.length > 1 ? (
    <Styled.BreadCrumbMenu>
      {_map(readButtonPads, (pad: ButtonPad) => (
        <Styled.BreadCrumbMenuItem
          active={buttonPad && buttonPad._id === pad._id}
          key={pad._id}
          onClick={() => handleActivateButtonPad(pad._id)}
        >
          button pad: {pad.buttonPadNum}
        </Styled.BreadCrumbMenuItem>
      ))}

      <BreadCrumbMenuCloseButton handleCloseMenu={handleCloseMenu} />
    </Styled.BreadCrumbMenu>
  ) : null;
};
