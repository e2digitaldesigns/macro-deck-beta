import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

export interface IntUseDropZoneHook {
  dropZones: {
    actionList: boolean;
    buttonPads: boolean;
    sideBarProfiles: boolean;
    sideBarStyles: boolean;
    styleHeader: boolean;
  };

  clearDropZones: () => void;
  setDropZone: (dropZone: string, status: boolean) => void;
}

const useDropZoneHook = (): IntUseDropZoneHook => {
  const globalDataStore = useGlobalDataStore(
    (state: Partial<IGlobalDataStore>) => state
  );

  const clearDropZones = () => {
    globalDataStore?.clearDropZones && globalDataStore.clearDropZones();
  };

  const setDropZone = (dropZone: string, status: boolean) => {
    globalDataStore?.setDropZone &&
      globalDataStore.setDropZone(dropZone, status);
  };

  return {
    dropZones: globalDataStore?.dropZones
      ? globalDataStore.dropZones
      : {
          actionList: false,
          buttonPads: false,
          sideBarProfiles: false,
          sideBarStyles: false,
          styleHeader: false
        },
    clearDropZones,
    setDropZone
  };
};

export default useDropZoneHook;
