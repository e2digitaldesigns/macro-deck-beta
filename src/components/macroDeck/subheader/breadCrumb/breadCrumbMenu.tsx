import React from "react";

import { BreadCrumbMenuTypes } from "../../../../types_";
import { usePage } from "../../../../hookers";

import { BreadCrumbMenuProfiles } from "./breadCrumbProfiles/breadCrumbProfiles";
import { BreadCrumbMenuPages } from "./breadCrumbPages/breadCrumbPages";
import { BreadCrumbMenuButtonPads } from "./breadCrumbButtonPads/breadCrumbButtonPads";
import { BreadCrumbMenuActions } from "./breadCrumbActions/breadCrumbActions";

export interface IntBreadCrumbMenu {
  dropDownType: string;
  handleSetActiveBreadCrumbMenu: (
    activeMenu: BreadCrumbMenuTypes | null
  ) => void;
}

const BreadCrumbMenu: React.FC<IntBreadCrumbMenu> = ({
  dropDownType,
  handleSetActiveBreadCrumbMenu
}) => {
  const { createPage } = usePage();

  const handleCreateNewPage = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    createPage();
    handleSetActiveBreadCrumbMenu(null);
  };

  const handleCloseMenu = (): void => {
    handleSetActiveBreadCrumbMenu(null);
  };

  return (
    <>
      <BreadCrumbMenuProfiles
        dropDownType={dropDownType as BreadCrumbMenuTypes}
        handleCloseMenu={handleCloseMenu}
      />

      <BreadCrumbMenuPages
        dropDownType={dropDownType as BreadCrumbMenuTypes}
        handleCloseMenu={handleCloseMenu}
        handleCreateNewPage={handleCreateNewPage}
      />

      <BreadCrumbMenuButtonPads
        dropDownType={dropDownType as BreadCrumbMenuTypes}
        handleCloseMenu={handleCloseMenu}
      />

      <BreadCrumbMenuActions
        dropDownType={dropDownType as BreadCrumbMenuTypes}
        handleCloseMenu={handleCloseMenu}
      />
    </>
  );
};

export default BreadCrumbMenu;
