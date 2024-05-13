import React from "react";
import * as Styled from "./Profile.style";

import ProfileList from "./ProfileList/ProfileList";
import ProfileEditor from "./profileEditor/profileEditor";
import ProfileNew from "./ProfileNew/ProfileNew";
import ProfileNewSoundBoard from "./profileNewSoundBoard/profileNewSoundBoard";

import { ProfileModes } from "../../../../types_";

const SideBarProfiles: React.FC = () => {
  const [profileMode, setProfileMode] = React.useState<ProfileModes>(
    ProfileModes.View
  );

  return (
    <Styled.ProfileWrapper>
      <Styled.ProfileListWrapper profileMode={profileMode}>
        <ProfileList setProfileMode={setProfileMode} />
      </Styled.ProfileListWrapper>

      <Styled.ProfileEditWrapper profileMode={profileMode}>
        <ProfileEditor setProfileMode={setProfileMode} />
      </Styled.ProfileEditWrapper>

      <Styled.ProfileNewWrapper profileMode={profileMode}>
        <ProfileNew setProfileMode={setProfileMode} />
      </Styled.ProfileNewWrapper>

      <Styled.ProfileNewSBWrapper profileMode={profileMode}>
        <ProfileNewSoundBoard setProfileMode={setProfileMode} />
      </Styled.ProfileNewSBWrapper>
    </Styled.ProfileWrapper>
  );
};

export default SideBarProfiles;
