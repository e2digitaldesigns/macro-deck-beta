import React from "react";
import _range from "lodash/range";
import * as Styled from "../../actionForm.styles";

interface UtilitiesDataFieldsProps {
  actionState: any;
  currentPlugin: any;
  disabled: boolean;
  handleChangePluginData: any;
  handleFilePathChange: any;
}

export const UtilitiesDataFields: React.FC<UtilitiesDataFieldsProps> = ({
  actionState,
  currentPlugin,
  disabled,
  handleChangePluginData,
  handleFilePathChange
}) => {
  const pluginData =
    currentPlugin.pluginActions.find(
      (action: any) => action.value === actionState.pluginAction
    )?.pluginData || [];

  const secondsParser = () => {
    return _range(1, 11).map((item: any, index: number) => ({
      value: item,
      displayText: `${item} Second${item > 1 ? "s" : ""}`
    }));
  };

  const optionsObject: { [key: string]: any } = {
    "ut:seconds": secondsParser()
  };

  const selectValueParser = (
    name: string,
    userValue: string,
    pluginValue: string
  ) => {
    return userValue ?? pluginValue;
  };

  return (
    <>
      {pluginData.map((plugin: any, index: number) => {
        return (
          <Styled.FieldSet key={index}>
            <Styled.Label htmlFor="action">{plugin.displayText}:</Styled.Label>

            {plugin.fieldType === "file" && (
              <Styled.FileField
                disabled={disabled}
                name={plugin.fieldName}
                id={plugin.fieldName}
                onChange={e => handleFilePathChange(e, plugin.fieldName)}
                accept={plugin?.fileType || "*"}
              />
            )}

            {plugin.fieldType === "select" && (
              <Styled.SelectField
                disabled={disabled}
                name={plugin.fieldName}
                onChange={handleChangePluginData}
                value={selectValueParser(
                  plugin.fieldName,
                  actionState?.pluginData?.[plugin.fieldName],
                  optionsObject?.[plugin.dataSet]?.[0]?.value
                )}
              >
                {!actionState?.pluginData?.[plugin.fieldName] && (
                  <option value="">Select</option>
                )}

                {optionsObject[plugin.dataSet].map(
                  (action: any, index: number) => (
                    <option key={index} value={action.value}>
                      {action.displayText}
                    </option>
                  )
                )}
              </Styled.SelectField>
            )}

            {plugin.fieldType === "range" && (
              <Styled.RangeField
                disabled={disabled}
                name={plugin.fieldName}
                onChange={e => handleChangePluginData(e)}
                value={actionState?.pluginData?.[plugin.fieldName] || "80"}
                max={100}
                min={0}
                step={1}
              />
            )}

            {plugin.fieldType === "text" && (
              <Styled.TextField
                disabled={disabled}
                name={plugin.fieldName}
                onChange={e => handleChangePluginData(e)}
                value={actionState?.pluginData?.[plugin.fieldName] || ""}
              />
            )}
          </Styled.FieldSet>
        );
      })}
    </>
  );
};
