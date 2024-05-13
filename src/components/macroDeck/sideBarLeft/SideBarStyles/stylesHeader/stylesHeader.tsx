import React from "react";
import { useDropZone, useStyle } from "../../../../../hookers";
import * as Styled from "./stylesHeader.styles";
import MacroDeckIcon from "../../../../../utils/icons/macroDeckIcons";
import { DragAndDropDataTypes } from "../../../../../types_";

const StylesHeader: React.FC = () => {
  const { createStyle, readStyles } = useStyle();
  const { dropZones } = useDropZone();

  const allowDrop = (ev: any) => {
    ev.preventDefault();
  };

  const handleDrop = async (ev: any) => {
    const buttonPadNum = ev.dataTransfer.getData(
      DragAndDropDataTypes.OriginPadNumber
    );

    createStyle(buttonPadNum);
  };

  return (
    <Styled.StylesHeader
      active={dropZones.styleHeader}
      data-testid="sidebar_style_header__component"
      onDragOver={e => allowDrop(e)}
      onDrop={e => handleDrop(e)}
    >
      <Styled.StylesHeaderIconHolder active={dropZones.styleHeader}>
        <MacroDeckIcon icon="Grid" />
      </Styled.StylesHeaderIconHolder>
      <div>
        <div>
          Available Styles{" "}
          <Styled.StylesHeaderCount>
            ({readStyles.length})
          </Styled.StylesHeaderCount>
          <br />
          <Styled.StylesHeaderMessage>
            Drop Button here 2 save style.
          </Styled.StylesHeaderMessage>
        </div>
      </div>
    </Styled.StylesHeader>
  );
};

export default StylesHeader;
