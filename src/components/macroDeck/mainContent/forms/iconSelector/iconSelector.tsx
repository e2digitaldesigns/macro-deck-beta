import React from "react";
import * as Styled from "./iconSelector.styles";
// import * as RFIcon from "react-feather";
import _filter from "lodash/filter";
import _map from "lodash/map";

import { useActive } from "../../../../../hookers";
import ICONS from "../../../../../utils/icons/json/featherIconDb.json";
import MacroDeckIcon from "../../../../../utils/icons/macroDeckIcons";

interface IntIconSelector {
  setIsIconSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewIcon: React.Dispatch<React.SetStateAction<string>>;
}
const IconSelector: React.FC<IntIconSelector> = ({
  setIsIconSelectorOpen,
  setNewIcon
}) => {
  const { buttonPad: activeButtonPad } = useActive();
  const [filter, setFilter] = React.useState<string>("");

  React.useEffect(() => {
    setFilter("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButtonPad]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleCloseIconSelector = (icon: string | null = null) => {
    icon !== null && setNewIcon(icon);
    setIsIconSelectorOpen(false);
  };

  const filterIcons = (iconSet: any) => {
    const filtered = filter
      ? _filter(iconSet, (m: any) =>
          m.display.toLowerCase().includes(filter.toLowerCase())
        )
      : iconSet;

    return filtered;
  };

  return (
    <>
      <Styled.IconListWrapper>
        <Styled.IconListSearchWrapper>
          <Styled.IconListSearchField
            autoFocus={true}
            data-testid="icon-selector__search-field"
            onChange={e => handleOnchange(e)}
            placeholder="search..."
            value={filter}
          />

          <Styled.CloseButton onClick={() => handleCloseIconSelector(null)}>
            Close
          </Styled.CloseButton>
        </Styled.IconListSearchWrapper>

        <Styled.IconListWrapperScroll>
          <Styled.IconGrid>
            <Styled.IconItem
              data-testid="icon-selector__none"
              onClick={() => handleCloseIconSelector("NONE")}
            >
              None
            </Styled.IconItem>

            {_map(filterIcons(ICONS), (m: any) => (
              <Styled.IconItem
                data-testid="icon-selector__icons"
                key={m._id}
                onClick={() => handleCloseIconSelector(m.name)}
              >
                <MacroDeckIcon icon={m.name} size="18" />
              </Styled.IconItem>
            ))}
          </Styled.IconGrid>
        </Styled.IconListWrapperScroll>
      </Styled.IconListWrapper>
    </>
  );
};

export default IconSelector;
