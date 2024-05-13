export type Profile = {
  _id: string;
  order: number;
  buttonPads: number;
  profileName: string;
};

export type Page = {
  _id: string;
  profileId: string;
  order: number;
};

export type ButtonPad = {
  _id: string;
  bgColor: string;
  buttonPadNum: number;
  icon: string;
  iconColor: string;
  image: string;
  pageId: string;
  profileId: string;
  text: string;
  textColor: string;
};

export type ActionData = {
  plugin: string;
  pluginAction: string;
  displayText: string;
  pluginData: object;
};

export type Action = {
  _id: string;
  action: string;
  buttonPadId: string;
  data: ActionData;
  layer: string;
  order: number;
  page: string;
  pageId: string;
  path: string;
  profile: string;
  profileId: string;
  scene: string;
  seconds: number;
  subAction: string;
  text: string;
  url: string;
  volume: number;
};

export type Style = {
  _id: string;
  bgColor: string;
  icon: string;
  iconColor: string;
  image: string;
  textColor: string;
};

export enum ButtonPadNums {
  bpn06 = 6,
  bpn08 = 8,
  bpn12 = 12,
  bpn15 = 15,
  bpn24 = 24,
  bpn32 = 32
}

export enum ButtonPadGridSize {
  BPGS32 = 32,
  BPGS36 = 36
}

export const AdjustGridButtonPadNums: ButtonPadNums[] = [
  ButtonPadNums.bpn06,
  ButtonPadNums.bpn15
];

export enum SectionRoutes {
  Home = "home",
  MacroDeck = "macroDeck",
  Settings = "settings",
  SettingsMacroDeck = "settings/macroDeck",
  SettingsObs = "settings/obs",
  SettingsServer = "settings/server",
  SettingsTwitch = "settings/twitch",
  Splash = "/splash"
}
