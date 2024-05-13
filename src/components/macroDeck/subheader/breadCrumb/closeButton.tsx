import React from "react";
import * as Styled from "./breadCrumbMenu.style";
import { XCircle } from "react-bootstrap-icons";

interface IBreadCrumbMenuCloseButton {
  handleCloseMenu: any;
}

export const BreadCrumbMenuCloseButton: React.FC<
  IBreadCrumbMenuCloseButton
> = ({ handleCloseMenu }) => {
  return (
    <Styled.BreadCrumbMenuItemClose onClick={handleCloseMenu}>
      <XCircle />
      <div>Close</div>
    </Styled.BreadCrumbMenuItemClose>
  );
};
