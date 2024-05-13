import React from "react";
import { Folder2, FolderFill, PencilSquare } from "react-bootstrap-icons";

import * as Styled from "./ProfileListItem.style";
import { Profile } from "../../../../../../types_";
import {
  useActive,
  useDragDropProfile,
  useProfile
} from "../../../../../../hookers";

interface IntProfileListItem {
  handleOpenProfileEdit: (e: React.MouseEvent<HTMLDivElement>) => void;
  profile: Profile;
}

const ProfileListItem: React.FC<IntProfileListItem> = ({
  handleOpenProfileEdit,
  profile
}) => {
  const { allowDrop, itemDrop, dragDropRef } = useDragDropProfile(profile._id);
  const [isHover, setIsHover] = React.useState<boolean | null>(null);

  const { activateProfile } = useProfile();
  const { profile: activeProfile } = useActive();

  const handleProfileActivate = (
    event: React.FormEvent<HTMLDivElement>
  ): void => {
    event.stopPropagation();
    profile?._id && activateProfile(profile?._id);
  };

  return (
    <Styled.ProfileListItem
      active={activeProfile._id === profile._id}
      data-testid="side_bar_item__component"
      draggable={true}
      onClick={handleProfileActivate}
      onDragOver={allowDrop}
      onDrop={(e: any) => itemDrop(e, profile._id)}
      ref={dragDropRef}
    >
      <div>
        {activeProfile._id === profile._id ? (
          <Styled.IconWrapper
            onClick={handleOpenProfileEdit}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <Styled.IconFolderWrapper isHover={isHover}>
              <FolderFill />
            </Styled.IconFolderWrapper>

            <Styled.IconEditWrapper isHover={isHover}>
              <PencilSquare />
            </Styled.IconEditWrapper>
          </Styled.IconWrapper>
        ) : (
          <Folder2 />
        )}
      </div>
      <div>{profile.profileName}</div>
      <div>{profile.buttonPads}</div>
    </Styled.ProfileListItem>
  );
};

export default ProfileListItem;
