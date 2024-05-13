import React from "react";

import _map from "lodash/map";
import _replace from "lodash/replace";
import _truncate from "lodash/truncate";

import SETTINGS from "../../../../../settings/system.json";
import * as Styled from "./profileEditor.style";
import * as FormStyles from "../../../../../styles/form.styles";
import { Profile, ProfileModes } from "../../../../../types_";

import { useActive, useProfile } from "../../../../../hookers";

interface IntProfileEditor {
  setProfileMode: (type: ProfileModes) => void;
}

const ProfileEditor: React.FC<IntProfileEditor> = ({ setProfileMode }) => {
  const { profile: activeProfile } = useActive();
  const { deleteProfile, updateProfile, readProfiles } = useProfile();

  const [profileState, setProfileState] = React.useState<Profile>({
    _id: "",
    order: 0,
    profileName: "",
    buttonPads: 6
  });

  React.useEffect(
    () => {
      if (activeProfile) {
        setProfileState({ ...activeProfile });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeProfile]
  );

  const handleFormChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ): void => {
    let { name, value } = event.target;
    if (name === "profileName") {
      value = _replace(value, new RegExp(/[^\da-zA-Z-_\s]/g), "");
      value = _truncate(value, {
        length: SETTINGS.APPLICATION.ButtonPadTextCharLength,
        omission: ""
      });
    }

    setProfileState({ ...profileState, [name]: value });
  };

  const handleUpdateProfile = (): void => {
    if (activeProfile) {
      updateProfile(profileState);
      handleClose();
    }
  };

  const handleDeleteProfile = (): void => {
    if (activeProfile) {
      deleteProfile(profileState._id);
      handleClose();
    }
  };

  const handleClose = (): void => {
    setProfileMode(ProfileModes.View);
  };

  if (!activeProfile) return null;

  return (
    <Styled.ProfileEditorWrapper>
      <Styled.FieldSet>
        <div>
          <label>Profile Name XX</label>
        </div>
        <div>
          <FormStyles.TextField
            name="profileName"
            onChange={e => handleFormChange(e)}
            placeholder="Profile Name"
            type="text"
            value={profileState.profileName}
          />
        </div>
      </Styled.FieldSet>

      <Styled.FieldSet>
        <div>
          <label>Button Pads</label>
        </div>
        <div>
          <FormStyles.SelectField
            name="buttonPads"
            onChange={e => handleFormChange(e)}
            value={profileState.buttonPads}
          >
            {_map(SETTINGS.BUTTON_PAD_AMOUNTS, (padNumber: number) => (
              <option key={padNumber} value={padNumber}>
                {padNumber}
              </option>
            ))}
          </FormStyles.SelectField>
        </div>
      </Styled.FieldSet>

      <Styled.ButtonHolder>
        <Styled.CloseButton onClick={handleClose}>Close</Styled.CloseButton>
        <Styled.SubmitButton onClick={handleUpdateProfile}>
          Save
        </Styled.SubmitButton>
      </Styled.ButtonHolder>

      <Styled.ButtonHolderBottom>
        <Styled.DeleteButton
          disabled={readProfiles.length < 2}
          onClick={handleDeleteProfile}
        >
          Delete
        </Styled.DeleteButton>
      </Styled.ButtonHolderBottom>
    </Styled.ProfileEditorWrapper>
  );
};

export default ProfileEditor;
