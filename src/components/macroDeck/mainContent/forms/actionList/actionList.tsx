import React from "react";
import _map from "lodash/map";
import { Action } from "../../../../../types_";
import * as Styled from "./actionList.styles";
import ActionListItem from "./actionListItem";

import { useAction, useActive } from "../../../../../hookers";

const ActionList: React.FC = () => {
  const { createAction, readActions: actions } = useAction();
  const { buttonPad } = useActive();

  const handleCreateAction = (): void => {
    createAction();
  };

  return (
    <Styled.Wrapper>
      <Styled.ActionListWrapper>
        <Styled.ActionListScroll>
          <ul>
            {actions &&
              _map(
                actions,
                (action: Action): React.ReactElement => (
                  <ActionListItem key={action._id} action={action} />
                )
              )}
          </ul>
        </Styled.ActionListScroll>
      </Styled.ActionListWrapper>
      <Styled.FieldSet>
        <Styled.ActionListNewButton
          data-testid="action-list__action-item-new"
          disabled={!buttonPad}
          onClick={handleCreateAction}
        >
          New Action
        </Styled.ActionListNewButton>
      </Styled.FieldSet>
    </Styled.Wrapper>
  );
};

export default ActionList;
