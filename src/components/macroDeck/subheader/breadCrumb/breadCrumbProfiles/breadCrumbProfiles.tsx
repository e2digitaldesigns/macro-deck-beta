import React from "react";
import * as Styled from "./../breadCrumbMenu.style";
import _map from "lodash/map";

import { BreadCrumbMenuTypes, Profile } from "../../../../../types_";
import { BreadCrumbMenuCloseButton } from "../closeButton";

import { useActive, useProfile } from "../../../../../hookers";

interface IBreadCrumbMenuProfiles {
  dropDownType: BreadCrumbMenuTypes;
  handleCloseMenu: () => void;
}

export const BreadCrumbMenuProfiles: React.FC<IBreadCrumbMenuProfiles> = ({
  dropDownType,
  handleCloseMenu
}) => {
  const { activateProfile, readProfiles } = useProfile();
  const { profile } = useActive();
  const profiles = readProfiles;

  const handleActivateProfile = (_id: string) => {
    activateProfile(_id);
    handleCloseMenu();
  };

  return dropDownType === BreadCrumbMenuTypes.Profile && profiles.length > 1 ? (
    <Styled.BreadCrumbMenu>
      {_map(profiles, (item: Profile) => (
        <Styled.BreadCrumbMenuItem
          active={item._id === profile?._id}
          key={item._id}
          onClick={() => handleActivateProfile(item._id)}
        >
          {item.profileName}
        </Styled.BreadCrumbMenuItem>
      ))}

      <BreadCrumbMenuCloseButton handleCloseMenu={handleCloseMenu} />
    </Styled.BreadCrumbMenu>
  ) : null;
};
