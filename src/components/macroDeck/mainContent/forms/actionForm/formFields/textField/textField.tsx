import React from "react";
import _upperFirst from "lodash/upperFirst";

// import { TextField } from "../../../../../../../../theme";

import * as Styled from "../../actionForm.styles";
import { Action } from "../../../../../../../types_";

export interface IntFormFieldTextProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  state: Action;
}

const FormFieldText: React.FC<IntFormFieldTextProps> = ({
  name,
  onChange,
  state
}) => (
  <>
    <Styled.Label htmlFor="action">{_upperFirst(name)}:</Styled.Label>

    <Styled.TextField
      data-testid="form_field_textField__input"
      name={name}
      onChange={e => onChange(e)}
      type="text"
      value={String(state?.[name as keyof Action])}
    />
  </>
);
export default FormFieldText;
