import React from "react";
import SETTINGS from "../../../../../settings/system.json";
import _isEqual from "lodash/isEqual";
import _replace from "lodash/replace";
import _truncate from "lodash/truncate";

import * as Styled from "./btmButtonPadForm.styles";
import { ButtonPad } from "../../../../../types_";

import { useActive, useAction, useButtonPad } from "../../../../../hookers";

export interface IntButtonForm {
  newIcon: string;
  setIsIconSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const isDefaultMatch = (
  defaultElements: Partial<ButtonPad>,
  state: ButtonPad
) => {
  return _isEqual(defaultElements, {
    textColor: state.textColor,
    iconColor: state.iconColor,
    bgColor: state.bgColor
  });
};

const BtmButtonPadForm: React.FC<IntButtonForm> = ({
  newIcon,
  setIsIconSelectorOpen
}) => {
  const { buttonPad: activeButtonPad } = useActive();
  const { deleteButtonPad, playButtonActions, updateButtonPad } =
    useButtonPad();
  const { readActions } = useAction();

  const defaultButtonPad: ButtonPad = SETTINGS.DEFAULT_STATE.BUTTON_PADS;
  const buttonPad = activeButtonPad || defaultButtonPad;

  const [state, setState] = React.useState(defaultButtonPad);

  const defaultButtonPadElements: Partial<ButtonPad> = {
    textColor: defaultButtonPad.textColor,
    iconColor: defaultButtonPad.iconColor,
    bgColor: defaultButtonPad.bgColor
  };

  const isDisabled = !activeButtonPad;
  const isActionPlayable = readActions.length > 0;

  const isSaveDisabled = _isEqual(state, buttonPad) || isDisabled;

  const revertToSavedDisabled = isDisabled || _isEqual(buttonPad, state);

  const resetToDefaultDisabled = !!(
    isDisabled ||
    (buttonPad && isDefaultMatch(defaultButtonPadElements, state))
  );

  React.useEffect(() => {
    setState({ ...state, icon: newIcon });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIcon]);

  React.useEffect(() => {
    activeButtonPad && setState(state => activeButtonPad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButtonPad]);

  const handleFormTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    let { name, value } = event.target;

    value = _replace(value, new RegExp(/[^\da-zA-Z-_\s]/g), "");
    value = _truncate(value, {
      length: SETTINGS.APPLICATION.ButtonPadTextCharLength,
      omission: ""
    });

    setState({ ...state, [name]: value });
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    buttonPad && state && updateButtonPad(state);
  };

  const handleResetButtonDefault = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setState({ ...buttonPad, ...defaultButtonPadElements });
    buttonPad &&
      state &&
      updateButtonPad({ ...buttonPad, ...defaultButtonPadElements });
  };

  const handleRevertButtonSaved = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setState({ ...buttonPad });
  };

  const handleButtonPadDelete = () => {
    buttonPad?._id && deleteButtonPad(buttonPad._id);
  };

  const handleOpenIconSelector = () => {
    if (!activeButtonPad) return;
    setIsIconSelectorOpen(true);
  };

  const handlePlayActions = () => {
    if (!activeButtonPad) return;
    playButtonActions(activeButtonPad._id);
  };

  return (
    <Styled.Wrapper>
      <Styled.FieldSet>
        <Styled.TextField
          data-testid="button_form__text-field-text"
          disabled={isDisabled}
          name="text"
          onChange={e => handleFormTextChange(e)}
          placeholder="Button Text..."
          type="text"
          value={state.text}
        />

        <Styled.ColorField
          disabled={isDisabled}
          data-testid="button_form__text-field-text-color"
          name="textColor"
          onChange={e => handleFormChange(e)}
          type="color"
          value={state.textColor}
        />
      </Styled.FieldSet>

      <Styled.FieldSet>
        <Styled.ButtonFormTextField
          data-testid="button_form__text-field-icon"
          onClick={handleOpenIconSelector}
          placeholder="Choose Icon..."
          readOnly
          type="text"
          value={state.icon}
        />

        <Styled.ColorField
          disabled={isDisabled}
          data-testid="button_form__text-field-text-color"
          name="iconColor"
          onChange={e => handleFormChange(e)}
          type="color"
          value={state.iconColor}
        />
      </Styled.FieldSet>

      <Styled.FieldSet>
        <Styled.ColorField
          data-testid="button_form__bg-color"
          disabled={isDisabled}
          name="bgColor"
          onChange={e => handleFormChange(e)}
          type="color"
          value={state?.bgColor || defaultButtonPad.bgColor}
        />
      </Styled.FieldSet>

      <Styled.FieldSet noGrid={true}>
        <Styled.ButtonGrid>
          <Styled.ActionButton
            data-testid="button_form__submit"
            disabled={isSaveDisabled}
            onClick={handleFormSubmit}
          >
            Save abs
          </Styled.ActionButton>

          <Styled.ActionButton
            data-testid="button_form__revert"
            disabled={revertToSavedDisabled}
            onClick={handleRevertButtonSaved}
          >
            Revert
          </Styled.ActionButton>

          <Styled.ActionButton
            data-testid="button_form__reset"
            disabled={resetToDefaultDisabled}
            onClick={handleResetButtonDefault}
          >
            Reset
          </Styled.ActionButton>
        </Styled.ButtonGrid>
      </Styled.FieldSet>

      <Styled.FieldSetBottom>
        <Styled.DeleteButton
          data-testid="button_form__delete"
          onClick={handleButtonPadDelete}
        >
          Delete
        </Styled.DeleteButton>

        <Styled.PlayButton
          data-testid="button_form__reset"
          disabled={!isActionPlayable}
          onClick={handlePlayActions}
        >
          Play
        </Styled.PlayButton>
      </Styled.FieldSetBottom>
    </Styled.Wrapper>
  );
};

export default BtmButtonPadForm;
