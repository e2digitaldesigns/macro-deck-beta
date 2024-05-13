import { IpcRendererTypes, IpcRendererTypesAction } from "./../../types_";
import { window } from "../../utils/window";

type TIPCRender = (
  name: IpcRendererTypes,
  data: IpcRendererTypesAction | object | string
) => void;

type TSaveAppData = (data: any) => void;

export interface IntElectronHook {
  ipcRenderParser: () => any;
  ipcRender: TIPCRender;
  updateMobileDevice: TSaveAppData;
}

const ipcRenderParser = () => {
  let ipcRender: any = null;

  if (window.electron && window.electron.ipcRenderer) {
    ipcRender = window.electron.ipcRenderer;
  }

  return ipcRender;
};

const useElectronHook = (): IntElectronHook => {
  const ipcRenderer = ipcRenderParser();

  const ipcRender: TIPCRender = (name, data) => {
    ipcRenderer && ipcRenderer.send(name, data);
  };

  const updateMobileDevice: TSaveAppData = data => {
    ipcRenderer &&
      ipcRenderer.send(IpcRendererTypes.database, {
        action: IpcRendererTypesAction.updateMobileDevice,
        data
      });
  };

  return {
    ipcRenderParser,
    ipcRender,
    updateMobileDevice
  };
};

export default useElectronHook;
