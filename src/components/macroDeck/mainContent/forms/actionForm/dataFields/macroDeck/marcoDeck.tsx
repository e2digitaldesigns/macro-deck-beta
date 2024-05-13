import React from "react";
import { usePage, useProfile } from "../../../../../../../hookers";
import * as Styled from "../../actionForm.styles";

interface MacroDeckDataFieldsProps {
  actionState: any;
  currentPlugin: any;
  disabled: boolean;
  handleChangePluginData: any;
  handleChangePluginDataParser: any;
}

export const MacroDeckDataFields: React.FC<MacroDeckDataFieldsProps> = ({
  actionState,
  currentPlugin,
  disabled,
  handleChangePluginData,
  handleChangePluginDataParser
}) => {
  const { readProfiles } = useProfile();
  const { readPages } = usePage();

  const pluginData =
    currentPlugin.pluginActions.find(
      (action: any) => action.value === actionState.pluginAction
    )?.pluginData || [];

  const optionsPageParser = (data: any[]) => {
    const parsedData = data.map((item: any, index: number) => ({
      value: index + 1,
      displayText: `${index} Page: ${index + 1}`
    }));
    return parsedData;
  };

  const optionsProfileParser = (data: any[]) => {
    const parsedData = data.map((item: any, index: number) => ({
      value: item._id,
      displayText: item.profileName
    }));
    return parsedData;
  };

  const optionsObject: { [key: string]: any } = {
    "md:pages": optionsPageParser(readPages),
    "md:profiles": optionsProfileParser(readProfiles)
  };

  React.useEffect(() => {
    console.log(62);
    if (!pluginData?.length) return;

    for (let i = 0; i < pluginData.length; i++) {
      const plugin = pluginData[i];

      const theValue =
        actionState.pluginData?.[plugin.fieldName] ??
        optionsObject?.[plugin.dataSet]?.[0]?.value;

      handleChangePluginDataParser({ [plugin.fieldName]: theValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pluginData]);

  return (
    <>
      {pluginData.map((plugin: any, index: number) => {
        return (
          <Styled.FieldSet key={index}>
            <Styled.Label htmlFor="action">{plugin.displayText}:</Styled.Label>

            {plugin.fieldType === "select" && (
              <Styled.SelectField
                disabled={disabled}
                name={plugin.fieldName}
                onChange={handleChangePluginData}
                value={actionState?.pluginData?.[plugin.fieldName]}
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
          </Styled.FieldSet>
        );
      })}
    </>
  );
};
