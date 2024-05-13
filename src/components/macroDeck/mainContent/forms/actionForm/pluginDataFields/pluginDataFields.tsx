import React from "react";
import _range from "lodash/range";

import { useObs, usePage, useProfile } from "../../../../../../hookers";

import * as Styled from "./../actionForm.styles";

interface PluginDataFieldProps {
  actionState: any;
  currentPlugin: any;
  disabled: boolean;
  handleChangePluginData: any;
  handleChangePluginDataParser: any;
  handleFilePathChange: any;
  listParserDisplayParser: any;
}

export const PluginDataField: React.FC<PluginDataFieldProps> = ({
  actionState,
  currentPlugin,
  disabled,
  handleChangePluginData,
  handleChangePluginDataParser,
  handleFilePathChange,
  listParserDisplayParser
}) => {
  const { readScenes, readSources } = useObs();
  const { readProfiles } = useProfile();
  const { readPages } = usePage();

  const [obsScenes, setObsScenes] = React.useState<any>([]);
  const [obsSceneItems, setObsSceneItems] = React.useState<any>([]);

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

  const optionsParser = (type: string, data: any[]) => {
    const parsedData = data.map((item: any, index: number) => ({
      value: item._id,
      displayText: type === "page" ? `Page: ${index + 1}` : item.profileName
    }));
    return parsedData;
  };

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
    "md:pages": optionsParser("page", readPages),
    "md:profiles": optionsParser("profile", readProfiles),
    "obs:scenes": obsScenes,
    "obs:scenes:items": obsItemsParser(
      obsScenes,
      obsSceneItems,
      actionState.pluginData?.sceneName
    ),
    "ut:seconds": secondsParser()
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

        // let sceneItemValues =
        //   scenes[0].value !==
        //     actionState.pluginData?.[pluginData[0].fieldName] &&
        //   items.find(
        //     (item: any) =>
        //       item.value === actionState.pluginData?.[pluginData[1].fieldName]
        //   )
        //     ? {
        //         itemId: actionState.pluginData?.[pluginData[1].fieldName],
        //         listParserDisplay: actionState.pluginData?.listParserDisplay
        //       }
        //     : {
        //         itemId: items[0]?.value,
        //         listParserDisplay: items[0]?.displayText
        //       };

        console.log(115, scenes[0].value);

        console.log(
          118,
          pluginData[0].fieldName,
          actionState.pluginData?.[pluginData[0].fieldName]
        );

        console.log(
          124,
          pluginData[1].fieldName,
          actionState.pluginData?.[pluginData[1].fieldName]
        );

        console.log(
          130,
          "scene",
          actionState.pluginData?.[pluginData[0].fieldName]
        );

        const isSceneMatch =
          scenes[0].value === actionState.pluginData?.[pluginData[0].fieldName];

        console.log(138, "isSceneMatch", isSceneMatch);

        console.log(140, sources);

        const filteredSources = sources?.filter(
          (item: any) =>
            item.parentScene ===
            actionState.pluginData?.[pluginData[0].fieldName]
        );

        console.log(148, filteredSources);
        console.log(149, actionState.pluginData?.[pluginData[1].fieldName]);

        const setSceneItem = filteredSources?.find(
          (item: any) =>
            item.sceneItemId ===
            actionState.pluginData?.[pluginData[1].fieldName]
        );

        console.log(157, "setSceneItem", setSceneItem);

        let sceneItemValues = setSceneItem
          ? {
              itemId: setSceneItem.value,
              listParserDisplay: setSceneItem.displayText
            }
          : {
              itemId: items[0]?.value,
              listParserDisplay: items[0]?.displayText
            };

        console.log(169, sceneItemValues);

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

  const selectValueParser = (
    name: string,
    userValue: string,
    pluginValue: string
  ) => {
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

      console.log(167, sceneItemIndex, e.target.value);

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

            {plugin.fieldType === "file" && (
              <Styled.FileField
                disabled={disabled}
                name={plugin.fieldName}
                id={plugin.fieldName}
                onChange={e => handleFilePathChange(e, plugin.fieldName)}
                accept={plugin?.fileType || "*"}
              />
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

            {plugin.fieldType === "select" && (
              <Styled.SelectField
                data-testid="action-form__action"
                disabled={disabled}
                name={plugin.fieldName}
                onChange={e => changePluginData(e)}
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
