import React from "react";
import * as Styled from "./../../actionForm.styles";
import { useObs } from "../../../../../../../hookers";

interface ObsDataFieldsProps {
  actionState: any;
  currentPlugin: any;
  disabled: boolean;
  handleChangePluginData: any;
  handleChangePluginDataParser: any;
  listParserDisplayParser: any;
}

export const ObsDataFields: React.FC<ObsDataFieldsProps> = ({
  actionState,
  currentPlugin,
  disabled,
  handleChangePluginData,
  handleChangePluginDataParser,
  listParserDisplayParser
}) => {
  const { readScenes, readSources } = useObs();
  const [obsScenes, setObsScenes] = React.useState<any>([]);
  const [obsSceneItems, setObsSceneItems] = React.useState<any>([]);

  const pluginData =
    currentPlugin.pluginActions.find(
      (action: any) => action.value === actionState.pluginAction
    )?.pluginData || [];

  const obsItemsParser = (
    obsScenes: any[],
    obsSceneItems: any[],
    sceneName: string | undefined
  ) => {
    const parsedData = obsScenes.length
      ? obsSceneItems.filter((item: any) => item.parentScene === sceneName)
      : [];

    return parsedData;
  };

  const optionsObject: { [key: string]: any } = {
    "obs:scenes": obsScenes,
    "obs:scenes:items": obsItemsParser(
      obsScenes,
      obsSceneItems,
      actionState.pluginData?.sceneName
    )
  };

  React.useEffect(() => {
    const fetchObsData = async () => {
      const scenes = await readScenes();
      const sources = await readSources();

      setObsScenes(scenes);
      setObsSceneItems(sources);

      if (hasScene && !hasSceneItem) {
        handleChangePluginDataParser({
          [pluginData[0].fieldName]:
            actionState.pluginData?.[pluginData[0].fieldName] ?? scenes[0].value
        });
      }

      if (hasScene && hasSceneItem) {
        const items = obsSceneItems.filter(
          (item: any) => item.parentScene === scenes[0].value
        );

        const filteredSources = sources?.filter(
          (item: any) =>
            item.parentScene ===
            actionState.pluginData?.[pluginData[0].fieldName]
        );

        const setSceneItem = filteredSources?.find(
          (item: any) =>
            item.sceneItemId ===
            actionState.pluginData?.[pluginData[1].fieldName]
        );

        let sceneItemValues = setSceneItem
          ? {
              itemId: setSceneItem.value,
              listParserDisplay: setSceneItem.displayText
            }
          : {
              itemId: items[0]?.value,
              listParserDisplay: items[0]?.displayText
            };

        listParserDisplayParser(sceneItemValues.listParserDisplay);

        handleChangePluginDataParser({
          [pluginData[0].fieldName]:
            actionState.pluginData?.[pluginData[0].fieldName] ||
            scenes[0].value,

          [pluginData[1].fieldName]: sceneItemValues.itemId
        });
      }
    };

    const hasScene = pluginData.some((item: any) => {
      return (
        item.dataSet === "obs:scenes" || item.dataSet === "obs:scenes:items"
      );
    });

    const hasSceneItem = pluginData.some((item: any) => {
      return item.dataSet === "obs:scenes:items";
    });

    if (hasScene || hasSceneItem) {
      fetchObsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pluginData]);

  const selectValueParser = (userValue: string, pluginValue: string) => {
    return userValue ?? pluginValue;
  };

  const changePluginData = (e: any) => {
    const hasSceneItem = pluginData.some((item: any) => {
      return item.dataSet === "obs:scenes:items";
    });

    if (e.target.name === "sceneName" && hasSceneItem) {
      const items = obsSceneItems.filter(
        (item: any) => item.parentScene === e.target.value
      );

      listParserDisplayParser(items[0].displayText);

      handleChangePluginDataParser({
        [pluginData[0].fieldName]: e.target.value,
        [pluginData[1].fieldName]: items[0].value
      });
    } else if (e.target.name === "sceneItemId") {
      const sceneItemIndex = optionsObject["obs:scenes:items"].findIndex(
        (item: any) => item.value === Number(e.target.value)
      );

      handleChangePluginDataParser({
        [pluginData[0].fieldName]:
          actionState.pluginData?.[pluginData[0].fieldName],
        [pluginData[1].fieldName]:
          optionsObject["obs:scenes:items"][sceneItemIndex].value
      });

      listParserDisplayParser(
        optionsObject["obs:scenes:items"][sceneItemIndex].displayText
      );
    } else {
      handleChangePluginData(e);
    }
  };

  if (!pluginData?.length) return null;

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
                onChange={e => changePluginData(e)}
                value={selectValueParser(
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
          </Styled.FieldSet>
        );
      })}
    </>
  );
};
