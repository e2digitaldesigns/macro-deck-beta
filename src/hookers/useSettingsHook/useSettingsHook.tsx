import React from "react";

import {
  IGlobalDataStore,
  useGlobalDataStore,
  MacroDeckSettings
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

import { useElectron } from "../../hookers";
import { IpcRendererTypes } from "../../types_";

type UpdateMaroDeckSettings = (port: string) => void;

export interface IntUseSettinsHook {
  macroDeckSetting: MacroDeckSettings | null;
  setSettings: () => void;
  updateMaroDeckSettings: UpdateMaroDeckSettings;
}

const useSettingsHook = (): IntUseSettinsHook => {
  const { ipcRender, ipcRenderParser } = useElectron();

  const { parseSettings, updateMacroDeckSettings } = useGlobalDataStore(
    (state: Partial<IGlobalDataStore>) => ({
      parseSettings: state.parseSettings,
      updateMacroDeckSettings: state.updateMacroDeckSettings
    })
  );

  React.useEffect(() => {
    const ipcRenderer = ipcRenderParser();
    if (!ipcRenderer) return;

    ipcRenderer.on(
      IpcRendererTypes.FetchMDSettingsReturn,
      (e: any, data: MacroDeckSettings) => {
        parseSettings && parseSettings(data);
      }
    );

    return () => {
      ipcRenderer.removeAllListeners(IpcRendererTypes.FetchMDSettingsReturn);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSettings = () => {
    ipcRender(IpcRendererTypes.FetchMDSettings, {});
  };

  const updateMaroDeckSettings: UpdateMaroDeckSettings = port => {
    updateMacroDeckSettings && updateMacroDeckSettings(port);
  };

  return {
    macroDeckSetting: useGlobalDataStore.getState().settings.macroDeck,
    setSettings,
    updateMaroDeckSettings
  };
};

export default useSettingsHook;
