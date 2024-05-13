import React from "react";
import * as Styled from "./subActionParser.styles";
import { usePage, useProfile } from "../../../../../../hookers";

export interface IntSubActionParser {
  action: any;
  showIcon?: boolean;
}

const SubActionParser: React.FC<IntSubActionParser> = ({ action }) => {
  const { readProfiles: profiles } = useProfile();
  const { readPages: pages } = usePage();

  let { displayText } = action?.data;

  //create object to map plugin actions to display text

  if (action?.data?.pluginAction === "mdPage") {
    const pageIndex = pages.findIndex(
      f => f._id === action.data.pluginData.pageId
    );

    displayText = displayText.replace("[[Page]]", `Page ${pageIndex + 1}`);
  }

  if (action?.data?.pluginAction === "mdProfile") {
    const profile = profiles.find(
      f => f._id === action.data.pluginData.profileId
    );

    displayText = displayText.replace("[[Profile]]", profile?.profileName);
  }

  if (action?.data?.pluginAction === "obsSceneChange") {
    displayText = `Scene: ${action.data.pluginData.sceneName}`;
  }

  if (action?.data?.pluginAction === "obsLayerToggle") {
    displayText = `Toggle Layer: ${action.data.pluginData.sceneName} - ${action.data.listParserDisplay}`;
  }

  if (action?.data?.pluginAction === "obsLayerHide") {
    displayText = `Hide Layer: ${action.data.pluginData.sceneName} - ${action.data.listParserDisplay}`;
  }

  if (action?.data?.pluginAction === "obsLayerShow") {
    displayText = `Show Layer: ${action.data.pluginData.sceneName} - ${action.data.listParserDisplay}`;
  }

  return (
    <Styled.SubActionDiv data-testid="sub-action-parser__text">
      <div>{action?.data?.plugin}</div>
      <div>{displayText || ""} </div>
    </Styled.SubActionDiv>
  );
};

export default SubActionParser;
