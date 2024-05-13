import React from "react";
import * as Styled from "./subHeader.style";

import { BreadCrumbMenuTypes } from "../../../types_";
import { useActive, usePage } from "../../../hookers";
import { BreadWrapper } from "./breadWrapper";

export const MacroDeckSubHeader: React.FC = () => {
  const [profileTitle, setProfileTitle] = React.useState("Select a Profile");
  const [activeBreadCrumbMenu, setActiveBreadCrumbMenu] =
    React.useState<BreadCrumbMenuTypes | null>(BreadCrumbMenuTypes.ButtonPad);

  const { action, buttonPad, pageNumber, profile } = useActive();
  const { readPages } = usePage();

  const pageTitle = `${pageNumber} / ${readPages.length || 0}`;

  const buttonPadTitle = `${buttonPad?.buttonPadNum | 0}/${
    profile?.buttonPads
  }`;

  const actionTitle = action?.data?.displayText;

  React.useEffect(() => {
    setActiveBreadCrumbMenu(activeBreadCrumbMenu => null);
  }, [action, buttonPad, pageNumber, profile]);

  React.useEffect(() => {
    setProfileTitle(profile?.profileName || "Select a Profile");
  }, [profile]);

  const handleSetActiveBreadCrumbMenu = (
    activeMenu: BreadCrumbMenuTypes | null
  ) => {
    setActiveBreadCrumbMenu(activeMenu);
  };

  return (
    <Styled.SubHeader>
      <BreadWrapper
        activeBreadCrumbMenu={activeBreadCrumbMenu}
        dropDownType={BreadCrumbMenuTypes.Profile}
        showChev={false}
        label="profile"
        handleSetActiveBreadCrumbMenu={handleSetActiveBreadCrumbMenu}
        title={profileTitle}
      />

      <BreadWrapper
        activeBreadCrumbMenu={activeBreadCrumbMenu}
        dropDownType={BreadCrumbMenuTypes.Page}
        label="page"
        handleSetActiveBreadCrumbMenu={handleSetActiveBreadCrumbMenu}
        title={pageTitle}
      />

      <BreadWrapper
        activeBreadCrumbMenu={activeBreadCrumbMenu}
        dropDownType={BreadCrumbMenuTypes.ButtonPad}
        label="button pad"
        handleSetActiveBreadCrumbMenu={handleSetActiveBreadCrumbMenu}
        title={buttonPadTitle}
      />

      <BreadWrapper
        activeBreadCrumbMenu={activeBreadCrumbMenu}
        dropDownType={BreadCrumbMenuTypes.Action}
        label="action"
        handleSetActiveBreadCrumbMenu={handleSetActiveBreadCrumbMenu}
        title={actionTitle}
      />
    </Styled.SubHeader>
  );
};
