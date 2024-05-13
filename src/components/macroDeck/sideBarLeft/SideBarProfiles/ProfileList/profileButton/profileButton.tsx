import React from "react";
import { PlusCircle } from "react-bootstrap-icons";
import * as Styled from "./profileButton.style";

import { ProfileModes } from "../../../../../../types_";

interface IntProfileButton {
  setProfileMode: (tyep: ProfileModes) => void;
}

const ProfileButton: React.FC<IntProfileButton> = ({ setProfileMode }) => {
  return (
    <>
      <Styled.NewProfileButton onClick={() => setProfileMode(ProfileModes.New)}>
        <div>
          <PlusCircle />
        </div>
        <div>New Profile</div>
      </Styled.NewProfileButton>
    </>
  );
};

export default ProfileButton;
