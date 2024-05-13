import React from "react";
import _upperFirst from "lodash/upperFirst";
import { Action } from "../../../../../../../types_";
import * as Styled from "../../actionForm.styles";

export interface IntFormFieldTextAreaProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  state: Action;
}

const FormFieldTextArea: React.FC<IntFormFieldTextAreaProps> = ({
  name,
  onChange,
  state
}) => (
  <>
    <Styled.Label htmlFor="action">{_upperFirst(name)}:</Styled.Label>

    <textarea
      data-testid="form_field_textArea__input"
      name={name}
      value={String(state?.[name as keyof Action])}
      onChange={e => onChange(e)}
    ></textarea>
  </>
);

export default FormFieldTextArea;
