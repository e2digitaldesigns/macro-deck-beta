import React from "react";
import _map from "lodash/map";

import * as Styled from "./SideBarStyles.style";
import StylesHeader from "./stylesHeader/stylesHeader";
import { useStyle } from "../../../../hookers";
import { Style } from "../../../../types_";
import ItemStyle from "./ItemStyle/ItemStyle";
import { SideBarScroller } from "../../Utils/SideBarScroller/SideBarScroller";

const SideBarStyles: React.FC = () => {
  const { readStyles } = useStyle();

  return (
    <Styled.SideBarStylesWrapper>
      <Styled.ItemListGrid>
        <StylesHeader />
        <SideBarScroller>
          {_map(
            readStyles,
            (style: Style): React.ReactElement => (
              <ItemStyle key={style._id} data={style} />
            )
          )}
        </SideBarScroller>
      </Styled.ItemListGrid>
    </Styled.SideBarStylesWrapper>
  );
};

export default SideBarStyles;
