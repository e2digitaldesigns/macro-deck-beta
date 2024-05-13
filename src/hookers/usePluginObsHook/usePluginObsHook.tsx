import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

export interface IntUsePluginObs {
  setPluginObs: () => void;
  obsPluginSettings: any;
  obsPluginSettingsUpdate: (settings: any) => void;
}

const useObsPluginHook = (): IntUsePluginObs => {
  const { setPluginObsSettings, setPluginObsSettingsUpdate } =
    useGlobalDataStore((state: Partial<IGlobalDataStore>) => ({
      setPluginObsSettings: state.setPluginObsSettings,
      setPluginObsSettingsUpdate: state.setPluginObsSettingsUpdate
    }));

  const setPluginObs = () => {
    setPluginObsSettings && setPluginObsSettings();
  };

  const obsPluginSettingsUpdate = (settings: any) => {
    setPluginObsSettingsUpdate && setPluginObsSettingsUpdate(settings);
  };

  return {
    setPluginObs,
    obsPluginSettings: useGlobalDataStore.getState().plugins.obs,
    obsPluginSettingsUpdate
  };
};

export default useObsPluginHook;
