import React from "react";
import * as Styled from "./ProfileList.style";

import _includes from "lodash/includes";
import _filter from "lodash/filter";
import _map from "lodash/map";
import _toLower from "lodash/toLower";

import ProfileButton from "./profileButton/profileButton";
import ProfileSearch from "./profileSearch/profileSearch";
import ProfileListItem from "./ProfileListItem/ProfileListItem";

import { Profile, ProfileModes } from "../../../../../types_";
import { SideBarScroller } from "../../../Utils/SideBarScroller/SideBarScroller";
import { useProfile } from "../../../../../hookers";

interface IntProfileList {
  setProfileMode: (type: ProfileModes) => void;
}

const ProfileList: React.FC<IntProfileList> = ({ setProfileMode }) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const { readProfiles: profiles } = useProfile();

  const handleOpenProfileEdit = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setProfileMode(ProfileModes.Edit);
  };

  const filteredProfiles = searchText
    ? _filter(profiles, (profile: Profile) =>
        _includes(_toLower(profile.profileName), _toLower(searchText))
      )
    : profiles;

  return (
    <Styled.ProfileListGrid>
      <ProfileButton setProfileMode={setProfileMode} />

      <ProfileSearch
        count={filteredProfiles.length}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <SideBarScroller>
        {_map(
          filteredProfiles,
          (profile: Profile): React.ReactElement => (
            <ProfileListItem
              key={profile._id}
              handleOpenProfileEdit={handleOpenProfileEdit}
              profile={profile}
            />
          )
        )}
      </SideBarScroller>
    </Styled.ProfileListGrid>
  );
};

export default ProfileList;
