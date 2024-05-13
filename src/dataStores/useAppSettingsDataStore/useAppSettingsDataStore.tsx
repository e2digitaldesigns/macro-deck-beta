import { create, StoreApi } from "zustand";

export type MacroDeckSettings = {
  baseUrl: string;
  ipAddress: string;
  port: string;
};

export interface IAppSettingsDataStore {
  macroDeck: MacroDeckSettings;
  parseSettings: (settingsObj: MacroDeckSettings) => void;
}

export const useAppSettingsDataStore = create<IAppSettingsDataStore>(
  (
    set: StoreApi<IAppSettingsDataStore>["setState"],
    get: StoreApi<IAppSettingsDataStore>["getState"]
  ) => ({
    macroDeck: {
      baseUrl: "",
      ipAddress: "",
      port: ""
    },

    parseSettings: settingsObj => {
      set({ macroDeck: settingsObj });
    }
  })
);
