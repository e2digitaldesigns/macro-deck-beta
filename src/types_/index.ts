export * from "./breadCrumbMenuTypes";
export * from "./applicationTypes";
export * from "./profileModes";
export * from "./ipcRenderTypes";
export * from "./dragAndDropTypes";
export * from "./ipcRenderTypes";
export * from "./subActionTypes";

export interface ISettingsFeaturesObs {
  ipAddress: string;
  port: string;
  password: string;
  status?: boolean;
}

export interface IMDSettings {
  ipAddress: string;
  port: string;
}

export enum FormFieldFileTypes {
  MDFileFieldExe = "mdFileFieldExe",
  MDFileFieldSound = "mdFileFieldSound",
  FileField = "fileField"
}
