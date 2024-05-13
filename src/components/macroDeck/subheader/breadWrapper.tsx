import React from "react";
import * as Styled from "./subHeader.style";
import { ChevronRight } from "react-bootstrap-icons";
import BreadCrumb from "./breadCrumb/breadCrumb";

import { BreadCrumbMenuTypes } from "../../../types_";

interface IntBreadWrapper {
  activeBreadCrumbMenu: BreadCrumbMenuTypes | null;
  dropDownType: BreadCrumbMenuTypes;
  label: string;
  showChev?: boolean;
  handleSetActiveBreadCrumbMenu: (
    activeMenu: BreadCrumbMenuTypes | null
  ) => void;
  title: string;
}

export const BreadWrapper: React.FC<IntBreadWrapper> = ({
  activeBreadCrumbMenu,
  dropDownType,
  label,
  showChev = true,
  handleSetActiveBreadCrumbMenu,
  title
}) => {
  return (
    <>
      {showChev && (
        <Styled.BreadCrumbHolder>
          <ChevronRight />
        </Styled.BreadCrumbHolder>
      )}
      <BreadCrumb
        activeBreadCrumbMenu={activeBreadCrumbMenu}
        dropDownType={dropDownType}
        label={label}
        title={title}
        handleSetActiveBreadCrumbMenu={handleSetActiveBreadCrumbMenu}
      />
    </>
  );
};
