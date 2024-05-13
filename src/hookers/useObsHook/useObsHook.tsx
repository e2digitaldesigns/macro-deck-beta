/* istanbul ignore file */
import OBSWebSocket from "obs-websocket-js";
import _map from "lodash/map";
import _sortBy from "lodash/sortBy";
import { useObsPlugin } from "..";

interface IObsScene {
  value: string;
  displayText: string;
}

interface IObsSceneItem {
  parentScene: string;
  scene: string;
  sceneItemId: number;
  sourceName: string;
  sortKey: string;
  displayText: string;
  value: number;
}

enum ObsCalls {
  GetSceneList = "GetSceneList",
  GetSceneItemList = "GetSceneItemList",
  GetGroupSceneItemList = "GetGroupSceneItemList"
}

export interface IntUseObsHook {
  readScenes: () => Promise<IObsScene[]>;
  readSources: () => Promise<IObsSceneItem[]>;
}

const useObsHook = (): IntUseObsHook => {
  const { obsPluginSettings } = useObsPlugin();
  const address = obsPluginSettings.baseUrl;
  const password = obsPluginSettings.password;

  const readScenes = async () => {
    try {
      const obs = new OBSWebSocket();
      await obs.connect(address, password);
      const { scenes } = await obs.call(ObsCalls.GetSceneList);
      await obs.disconnect();

      const allScenes: IObsScene[] = [];

      _map(scenes, scene => {
        allScenes.push({
          value: scene.sceneName as string,
          displayText: scene.sceneName as string
        });
      });

      return _sortBy(allScenes, scene => scene.displayText.toLowerCase());
    } catch (error) {
      return [];
    }
  };

  const readSources = async () => {
    try {
      const obs = new OBSWebSocket();
      await obs.connect(address, password);
      const { scenes } = await obs.call(ObsCalls.GetSceneList);
      const fullArray: IObsSceneItem[] = [];

      for (const scene of scenes) {
        let { sceneItems } = await obs.call(ObsCalls.GetSceneItemList, {
          sceneName: scene.sceneName as string
        });

        for (const sceneItem of sceneItems) {
          fullArray.push({
            parentScene: scene.sceneName as string,
            scene: scene.sceneName as string,
            sceneItemId: sceneItem.sceneItemId as number,
            sourceName: sceneItem.sourceName as string,
            sortKey: sceneItem.sourceName as string,
            displayText: sceneItem.sourceName as string,
            value: sceneItem.sceneItemId as number
          });

          if (sceneItem.isGroup) {
            const { sceneItems: groupItems } = await obs.call(
              ObsCalls.GetGroupSceneItemList as any,
              {
                sceneName: sceneItem.sourceName as string
              }
            );

            groupItems.forEach((groupItem: any) => {
              fullArray.push({
                parentScene: scene.sceneName as string,
                scene: sceneItem.sourceName as string,
                sceneItemId: groupItem.sceneItemId,
                sourceName: groupItem.sourceName as string,
                sortKey: sceneItem.sourceName + " " + groupItem.sourceName,
                displayText: sceneItem.sourceName + " " + groupItem.sourceName,
                value: groupItem.sceneItemId
              });
            });
          }
        }
      }

      await obs.disconnect();

      return _sortBy(fullArray, ["sortKey"]);
    } catch (error) {
      return [];
    }
  };

  return {
    readScenes,
    readSources
  };
};

export default useObsHook;
