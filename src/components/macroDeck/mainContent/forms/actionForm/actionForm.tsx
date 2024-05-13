import React from "react";
import { useAction, useActive } from "../../../../../hookers";
import { pluginsArr } from "./actionsDb";
import * as Styled from "./actionForm.styles";
import { MacroDeckDataFields } from "./dataFields/macroDeck/marcoDeck";
import { UtilitiesDataFields } from "./dataFields/utilities/utilities";
import { ObsDataFields } from "./dataFields/obs/obs";

const defaultState = {
  plugin: "md",
  pluginAction: "mdRefresh",
  displayText: "Refresh App",
  listParserDisplay: "",
  pluginData: []
};

enum PluginTypes {
  OBS = "obs",
  Macrodeck = "md",
  Utilities = "ut"
}

const ActionForm: React.FC<{}> = () => {
  const { action: activeAction } = useActive();
  const { updateAction } = useAction();
  const [actionState, setActionState] = React.useState<any>(defaultState);
  const [currentPlugin, setCurrentPlugin] = React.useState<any>(pluginsArr[0]);

  const actionId = activeAction?._id;
  const disabled = !actionId;

  React.useEffect(() => {
    if (activeAction) {
      const thePlugin = pluginsArr.find(
        (p: any) => p.plugin === activeAction.data.plugin
      );

      const newActionState = {
        plugin: activeAction.data.plugin,
        pluginAction: activeAction.data.pluginAction,
        displayText: activeAction.data.displayText,
        listParserDisplay: activeAction.data.listParserDisplay,
        pluginData: activeAction.data.pluginData
      };

      setCurrentPlugin(thePlugin);
      setActionState(newActionState);
    }
  }, [activeAction]);

  const handleChangePlugin = (plugin: any) => {
    const thePlugin = pluginsArr.find((p: any) => p.plugin === plugin);
    setCurrentPlugin(thePlugin);

    const newActionState = {
      plugin: plugin,
      pluginAction: thePlugin?.pluginActions?.[0]?.value || "",
      displayText: thePlugin?.pluginActions?.[0]?.displayText || "",
      pluginData: []
    };

    setActionState(newActionState);
  };

  const handleChangePluginAction = (action: any) => {
    const index = currentPlugin.pluginActions.findIndex(
      (a: any) => a.value === action
    );

    setActionState((prevState: any) => ({
      ...prevState,
      pluginAction: action,
      displayText: currentPlugin?.pluginActions?.[index]?.displayText || "",
      pluginData: []
    }));
  };

  const handleChangePluginData = (e: any) => {
    const pluginData = {
      ...actionState.pluginData
    };

    pluginData[e.target.name] = e.target.value;

    setActionState((prevState: any) => ({
      ...prevState,
      pluginData
    }));
  };

  const handleFilePathChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const fileInput: any = document.getElementById(id) as HTMLInputElement;
    const path = fileInput?.files?.[0].path as string;

    const pluginData = {
      ...actionState.pluginData
    };

    pluginData[e.target.name] = path;

    setActionState((prevState: any) => ({
      ...prevState,
      pluginData
    }));
  };

  const listParserDisplayParser = (value: string) => {
    setActionState((prevState: any) => ({
      ...prevState,
      listParserDisplay: value
    }));
  };

  const handleChangePluginDataParser = (pluginData: any) => {
    setActionState((prevState: any) => ({
      ...prevState,
      pluginData
    }));
  };

  const handleSubmit = () => {
    if (actionState?.plugin && actionState?.pluginAction) {
      updateAction(actionId, actionState);
    }
  };

  return (
    <Styled.Wrapper>
      <Styled.FieldSet>
        <Styled.Label htmlFor="action">Plugin:</Styled.Label>

        <Styled.SelectField
          data-testid="action-form__action"
          value={actionState?.plugin}
          onChange={e => handleChangePlugin(e.target.value)}
          disabled={disabled}
        >
          {!actionState?.plugin && <option value="">Choose Action</option>}
          {pluginsArr.map((plugin: any) => (
            <option key={plugin.value} value={plugin.value}>
              {plugin.displayText}
            </option>
          ))}
        </Styled.SelectField>
      </Styled.FieldSet>

      <Styled.FieldSet>
        <Styled.Label htmlFor="action">Action:</Styled.Label>

        <Styled.SelectField
          value={actionState?.pluginAction}
          onChange={e => handleChangePluginAction(e.target.value)}
          disabled={disabled}
        >
          {!actionState?.pluginAction && (
            <option value="">Choose Action</option>
          )}

          {currentPlugin?.pluginActions.map((action: any) => (
            <option key={action.value} value={action.value}>
              {action.displayTextForm}
            </option>
          ))}
        </Styled.SelectField>
      </Styled.FieldSet>

      {actionState?.plugin === PluginTypes.Macrodeck && (
        <MacroDeckDataFields
          actionState={actionState}
          currentPlugin={currentPlugin}
          disabled={disabled}
          handleChangePluginData={handleChangePluginData}
          handleChangePluginDataParser={handleChangePluginDataParser}
        />
      )}

      {actionState?.plugin === PluginTypes.OBS && (
        <ObsDataFields
          actionState={actionState}
          currentPlugin={currentPlugin}
          disabled={disabled}
          handleChangePluginData={handleChangePluginData}
          handleChangePluginDataParser={handleChangePluginDataParser}
          listParserDisplayParser={listParserDisplayParser}
        />
      )}

      {actionState?.plugin === PluginTypes.Utilities && (
        <UtilitiesDataFields
          actionState={actionState}
          currentPlugin={currentPlugin}
          disabled={disabled}
          handleChangePluginData={handleChangePluginData}
          handleFilePathChange={handleFilePathChange}
        />
      )}

      <Styled.FieldSetBottom>
        <Styled.SubmitButton disabled={disabled} onClick={handleSubmit}>
          Submit xxx
        </Styled.SubmitButton>
      </Styled.FieldSetBottom>
    </Styled.Wrapper>
  );
};

export default ActionForm;
