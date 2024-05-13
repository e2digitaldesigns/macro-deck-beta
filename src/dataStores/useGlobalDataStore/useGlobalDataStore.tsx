import axios from "axios";
import { create, StoreApi } from "zustand";

import {
  Action,
  ActionData,
  ButtonPad,
  Page,
  Profile,
  Style
} from "../../types_";

export type MacroDeckSettings = {
  baseUrl: string;
  ipAddress: string;
  port: string;
};

export type OBSSettings = {
  baseUrl: string;
  password: string;
  ipAddress: string;
  port: string;
};

export type ApplicationSettings = {
  macroDeck: MacroDeckSettings;
};

export type Plugins = {
  obs: OBSSettings;
};

export interface IGlobalDataStore {
  settings: ApplicationSettings;
  plugins: Plugins;
  profiles: Profile[];
  pages: Page[];
  buttonPads: ButtonPad[];
  actions: Action[];

  activeProfile: Profile | null;
  activePage: Page | null;
  activePageNumber: number;
  activeButtonPad: ButtonPad | null;
  activeAction: Action | null;

  copyButtonPadId: string | null;
  dropZones: {
    actionList: boolean;
    buttonPads: boolean;
    sideBarProfiles: boolean;
    sideBarStyles: boolean;
    styleHeader: boolean;
  };

  formProfiles: Profile[];
  formPages: Page[];

  styles: Style[];

  setPluginObsSettings: () => void;
  setPluginObsSettingsUpdate: (obsSettings: OBSSettings) => void;
  parseSettings: (settingsObj: MacroDeckSettings) => void;
  updateMacroDeckSettings: (port: string) => void;

  activateProfile: (_id: string) => void;
  createProfile: (type: string) => void;
  fetchProfiles: (returnProfileId?: string) => void;
  removeProfile: (_id: string) => void;
  reOrderProfiles: (dragId: string, dropId: string) => void;
  updateProfile: (profile: Profile) => void;

  activatePage: (_id: string) => void;
  createPage: () => void;
  fetchPages: (profileId?: string) => void;
  removePage: (_id: string) => void;

  activateButtonPad: (_id: string) => void;
  copyButtonPad: (_id: string) => void;
  createButtonPad: (buttonPadNumber: number) => void;
  fetchButtonPads: (pageId?: string) => void;
  overWriteButtonPads: (
    sourcePadNumber: number,
    destinationPadNumber: number
  ) => void;
  pasteButtonPad: (destinationPadId: string) => void;
  playButtonActions: (buttonPadId?: string) => void;
  removeButtonPad: (_id: string) => void;
  updateButtonPad: (buttonPad: ButtonPad) => void;

  swapButtonPads: (
    sourcePadNumber: number,
    destinationPadNumber: number
  ) => void;

  activateAction: (_id: string) => void;
  createAction: () => void;
  fetchActions: (buttonPadId?: string) => void;
  removeAction: (_id: string) => void;
  reOrderActions: (dragId: string, dropId: string) => void;
  updateAction: (_id: string, action: ActionData) => void;

  applyStyle: (styleId: string, buttonPadNum: number) => void;
  createStyle: (buttonPadNum: number) => void;
  fetchStyles: () => void;
  removeStyle: (_id: string) => void;

  updateMobileDevice: () => void;

  clearDropZones: () => void;
  setDropZone: (dropZone: string, status: boolean) => void;
}

const API = {
  ACTIONS: `actions`,
  BUTTON_PADS: `buttonPads`,
  PAGE: `pages`,
  PROFILE: `profiles`,
  STYLE: `styles`
};

export const useGlobalDataStore = create<IGlobalDataStore>(
  (
    set: StoreApi<IGlobalDataStore>["setState"],
    get: StoreApi<IGlobalDataStore>["getState"]
  ) => ({
    settings: {
      macroDeck: {
        baseUrl: "",
        ipAddress: "",
        port: ""
      }
    },
    plugins: {
      obs: {
        baseUrl: "",
        password: "",
        ipAddress: "",
        port: ""
      }
    },
    profiles: [],
    pages: [],
    buttonPads: [],
    actions: [],
    activeProfile: null,
    activePage: null,
    activePageNumber: 0,
    activeButtonPad: null,
    activeAction: null,
    copyButtonPadId: null,

    dropZones: {
      actionList: false,
      buttonPads: false,
      sideBarProfiles: false,
      sideBarStyles: false,
      styleHeader: false
    },

    formProfiles: [],
    formPages: [],

    styles: [],

    setPluginObsSettings: async () => {
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}plugins/obs`
      );

      if (data.success) {
        set({
          plugins: { ...get().plugins, obs: data.settings }
        });
      }
    },

    setPluginObsSettingsUpdate: async (obsSettings: OBSSettings) => {
      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}plugins/obs`,
        {
          ...obsSettings
        }
      );

      if (data.success) {
        set({
          plugins: { ...get().plugins, obs: obsSettings }
        });
      }
    },

    parseSettings: settingsObj => {
      set({
        settings: { ...get().settings, macroDeck: settingsObj }
      });
    },

    updateMacroDeckSettings: async (port: string) => {
      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}settings`,
        {
          port
        }
      );

      if (data.success) {
        set({
          settings: {
            ...get().settings,
            macroDeck: { ...get().settings.macroDeck, port }
          }
        });
      }
    },
    // form  / form  / form  ////////////////////////////////////////////////////////////
    fetchFormProfiles: async () => {
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}${API.PROFILE}`
      );

      if (data.success) {
        set({ formProfiles: data.profiles });
      }
    },

    fetchFormPages: async (id: string) => {
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}${API.PAGE}/${id}`
      );

      if (data.success) {
        set({ formPages: data.pages });
      }
    },
    // form  / form  / form  ////////////////////////////////////////////////////////////

    activateProfile: (_id: string) => {
      const activeProfile = get().profiles.find(
        (item: Profile) => item._id === _id
      );
      set({ activeProfile });
    },

    createProfile: async (type: string) => {
      try {
        const { data } = await axios.post(
          `${get().settings.macroDeck.baseUrl}${API.PROFILE}`,
          { type }
        );

        if (data.success) {
          get().fetchProfiles(data.profile._id);
          get().updateMobileDevice();
        }
      } catch (error) {}
    },

    reOrderProfiles: async (dragId: string, dropId: string) => {
      const newProfiles = [...get().profiles];
      const sendArray = [];

      const dragIndex = newProfiles.findIndex(
        (item: Profile) => item._id === dragId
      );

      const dropIndex = newProfiles.findIndex(
        (item: Profile) => item._id === dropId
      );

      const dragProfile = newProfiles[dragIndex];

      if (dragIndex > dropIndex) {
        newProfiles.splice(dragIndex, 1);
        newProfiles.splice(dropIndex, 0, dragProfile);
      }

      if (dragIndex < dropIndex) {
        newProfiles.splice(dropIndex + 1, 0, dragProfile);
        newProfiles.splice(dragIndex, 1);
      }

      for (let i = 0; i < newProfiles.length; i++) {
        newProfiles[i].order = i;
        sendArray.push({ _id: newProfiles[i]._id, order: i });
      }

      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}${API.PROFILE}/reOrder`,
        {
          data: sendArray
        }
      );

      if (data?.success) {
        set({ profiles: newProfiles });
        get().updateMobileDevice();
      }
    },

    removeProfile: async (profileId: string) => {
      try {
        const { data } = await axios.delete(
          `${get().settings.macroDeck.baseUrl}${API.PROFILE}/${profileId}`
        );

        if (data.success) {
          const filteredProfiles = get().profiles.filter(
            (profile: Profile) => profile._id !== profileId
          );
          set({
            profiles: filteredProfiles,
            activeProfile: filteredProfiles[0]
          });
          get().updateMobileDevice();
        }
      } catch (error) {}
    },

    fetchProfiles: async (returnProfileId?: string) => {
      set({ activePage: null });
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}profiles`
      );

      if (data.success) {
        set({ profiles: data.profiles });

        const profileId = returnProfileId || data.profiles?.[0]?._id;

        if (profileId) {
          get().activateProfile(profileId);
          get().fetchPages(profileId);
        } else {
          set({ activeProfile: null });
        }
      }
    },

    updateProfile: async profile => {
      const profileIndex = get().profiles.findIndex(
        (item: Profile) => item._id === profile._id
      );

      if (profileIndex > -1) {
        const { data } = await axios.put(
          `${get().settings.macroDeck.baseUrl}${API.PROFILE}`,
          profile
        );

        if (data.success === 1) {
          const newProfiles = [...get().profiles];
          newProfiles[profileIndex] = profile;
          set({ activeProfile: profile, profiles: newProfiles });
          get().updateMobileDevice();
        }
      }
    },

    // pages / pages / pages ////////////////////////////////////////////////////////////

    activatePage: (_id: string) => {
      const pages = get().pages;
      const activePage = pages.find((item: Page) => item._id === _id);
      const pageNumber = pages.findIndex((page: Page) => page._id === _id) + 1;
      set({ activePage, activePageNumber: pageNumber });
    },

    createPage: async () => {
      const { data } = await axios.post(
        `${get().settings.macroDeck.baseUrl}${API.PAGE}`,
        {
          profileId: get().activeProfile?._id
        }
      );

      if (data?.success) {
        set({
          pages: [
            ...get().pages,
            {
              _id: data.page._id,
              profileId: data.page.profileId,
              order: data.page.order
            }
          ]
        });
        get().updateMobileDevice();
      }
    },

    fetchPages: async profileId => {
      const id = profileId || get().activeProfile?._id;
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}${API.PAGE}/${id}`
      );
      set({ activeButtonPad: null });

      if (data.success) {
        set({ pages: data.pages });

        const pageId = data.pages?.[0]?._id;

        if (pageId) {
          get().activatePage(pageId);
          get().fetchButtonPads(pageId);
        } else {
          set({ activePage: null, activePageNumber: 0 });
        }
      }
    },

    removePage: async (_id: string) => {
      const filteredPages = get().pages.filter(
        (item: Page) => item._id !== _id
      );

      const { data } = await axios.delete(
        `${get().settings.macroDeck.baseUrl}${API.PAGE}/${_id}`
      );

      if (data?.error === 0) {
        set({
          pages: filteredPages,
          activePage: filteredPages[0]
        });
        get().updateMobileDevice();
      }
    },

    // pages / pages / pages ////////////////////////////////////////////////////////////

    // bpads / bpads  / bpads  ////////////////////////////////////////////////////////////

    activateButtonPad: (_id: string) => {
      const buttonPads = get().buttonPads;
      const activeButtonPad = buttonPads.find(
        (item: ButtonPad) => item._id === _id
      );
      set({ activeButtonPad: activeButtonPad || null });
    },

    copyButtonPad: (_id: string) => {
      const buttonPad = get().buttonPads.find(
        (item: ButtonPad) => item._id === _id
      );

      set({ copyButtonPadId: buttonPad?._id || null });
    },

    pasteButtonPad: async (destinationPadId: string) => {
      const { copyButtonPadId } = get();

      if (copyButtonPadId && copyButtonPadId !== destinationPadId) {
        const { data } = await axios.post(
          `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}/copy`,
          {
            destinationId: destinationPadId,
            originId: copyButtonPadId
          }
        );

        if (data?.success) {
          const buttonPadIndex = get().buttonPads.findIndex(
            (item: ButtonPad) => item._id === destinationPadId
          );

          if (buttonPadIndex > -1) {
            const newButtonBads = [...get().buttonPads];
            newButtonBads[buttonPadIndex] = data.buttonPad;
            set({
              buttonPads: newButtonBads,
              activeButtonPad: data.buttonPad
            });
            get().updateMobileDevice();
          }
        }
      }
    },

    playButtonActions: async (buttonPadId?: string) => {
      const _id = buttonPadId ? buttonPadId : get().activeButtonPad?._id;

      axios.post(`${get().settings.macroDeck.baseUrl}mobile/actions/`, {
        _id
      });
    },

    createButtonPad: async (buttonPadNumber: number) => {
      const { data } = await axios.post(
        `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}`,
        {
          profileId: get().activeProfile?._id,
          pageId: get().activePage?._id,
          buttonPadNum: buttonPadNumber
        }
      );

      if (data?.success) {
        set({ buttonPads: [...get().buttonPads, data.buttonPad] });
        get().activateButtonPad(data.buttonPad._id);
        get().updateMobileDevice();
      }
    },

    fetchButtonPads: async pageId => {
      const id = pageId || get().activePage?._id;
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}/${id}`
      );
      set({ activeAction: null });

      if (data?.success) {
        set({ buttonPads: data.buttonPads });
        const buttonPadId = data.buttonPads?.[0]?._id;

        if (buttonPadId) {
          get().activateButtonPad(buttonPadId);
          get().fetchActions(buttonPadId);
        } else {
          set({ activeButtonPad: null });
        }
      }
    },

    overWriteButtonPads: async (
      sourcePadNumber: number,
      destinationPadNumber: number
    ) => {
      const sourcePadId = get().buttonPads.find(
        (item: ButtonPad) => item.buttonPadNum === sourcePadNumber
      )?._id;

      const destinationPadIndex = get().buttonPads.findIndex(
        (item: ButtonPad) => item.buttonPadNum === destinationPadNumber
      );

      const destinationPadId =
        destinationPadIndex > -1
          ? get().buttonPads[destinationPadIndex]?._id
          : null;

      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}${
          API.BUTTON_PADS
        }/buttonPadOverwrite`,
        {
          sourcePadId,
          sourcePadNumber,
          destinationPadId,
          destinationPadNumber
        }
      );

      if (data?.success) {
        const newButtonPads = [...get().buttonPads];
        if (destinationPadIndex > -1) {
          newButtonPads.splice(destinationPadIndex, 1);
        }

        newButtonPads.push(data.buttonPad);
        set({ buttonPads: newButtonPads, activeButtonPad: data.buttonPad });
        get().updateMobileDevice();
      }
    },

    removeButtonPad: async (_id: string) => {
      const filteredButtonPads = get().buttonPads.filter(
        (item: ButtonPad) => item._id !== _id
      );

      const { data } = await axios.delete(
        `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}/${_id}`
      );

      if (data?.success) {
        set({
          buttonPads: filteredButtonPads,
          activeButtonPad: filteredButtonPads[0] || null
        });
        get().updateMobileDevice();
      }
    },

    swapButtonPads: async (
      sourcePadNumber: number,
      destinationPadNumber: number
    ) => {
      const sourcePadId = get().buttonPads.find(
        (item: ButtonPad) => item.buttonPadNum === sourcePadNumber
      )?._id;

      const destinationPadId = get().buttonPads.find(
        (item: ButtonPad) => item.buttonPadNum === destinationPadNumber
      )?._id;

      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}/buttonPadSwap`,
        {
          sourcePadId,
          sourcePadNumber,
          destinationPadId,
          destinationPadNumber
        }
      );

      if (data?.success) {
        const newButtonPads = [...get().buttonPads];

        const sourcePadIndex = get().buttonPads.findIndex(
          (item: ButtonPad) => item._id === sourcePadId
        );

        if (sourcePadIndex > -1)
          newButtonPads[sourcePadIndex].buttonPadNum = destinationPadNumber;

        if (destinationPadId) {
          const destinationPadIndex = get().buttonPads.findIndex(
            (item: ButtonPad) => item._id === destinationPadId
          );

          if (destinationPadIndex > -1)
            newButtonPads[destinationPadIndex].buttonPadNum = sourcePadNumber;
        }

        set({ buttonPads: newButtonPads });
        get().updateMobileDevice();
      }
    },

    updateButtonPad: async (buttonPad: ButtonPad) => {
      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}/${
          buttonPad._id
        }`,
        buttonPad
      );

      if (data?.success) {
        const buttonPadIndex = get().buttonPads.findIndex(
          (item: ButtonPad) => item._id === buttonPad._id
        );

        if (buttonPadIndex > -1) {
          const newButtonPads = [...get().buttonPads];
          newButtonPads[buttonPadIndex] = buttonPad;
          set({ buttonPads: newButtonPads, activeButtonPad: buttonPad });
          get().updateMobileDevice();
        }
      }
    },

    // bpads / bpads  / bpads  ////////////////////////////////////////////////////////////

    // actions / actions    ////////////////////////////////////////////////////////////

    activateAction: (_id: string) => {
      const actions = get().actions;
      const activeAction = actions.find((item: Action) => item._id === _id);
      set({ activeAction: activeAction || null });
    },

    createAction: async () => {
      const { data } = await axios.post(
        `${get().settings.macroDeck.baseUrl}${API.ACTIONS}`,
        {
          profileId: get().activeProfile?._id,
          pageId: get().activePage?._id,
          buttonPadId: get().activeButtonPad?._id
        }
      );

      if (data?.success) {
        set({ actions: [...get().actions, data.action] });
        get().activateAction(data.action._id);
      }
    },

    removeAction: async (_id: string) => {
      const filteredActions = get().actions.filter(
        (item: Action) => item._id !== _id
      );

      const { data } = await axios.delete(
        `${get().settings.macroDeck.baseUrl}${API.ACTIONS}/${_id}`
      );

      if (data?.success) {
        set({
          actions: filteredActions,
          activeAction: filteredActions[0] || null
        });
      }
    },

    reOrderActions: async (dragId, dropId) => {
      const newActions = [...get().actions];
      const sendArray = [];

      const dragIndex = newActions.findIndex(
        (item: Action) => item._id === dragId
      );

      const dropIndex = newActions.findIndex(
        (item: Action) => item._id === dropId
      );

      const dragProfile = newActions[dragIndex];

      if (dragIndex > dropIndex) {
        newActions.splice(dragIndex, 1);
        newActions.splice(dropIndex, 0, dragProfile);
      }

      if (dragIndex < dropIndex) {
        newActions.splice(dropIndex + 1, 0, dragProfile);
        newActions.splice(dragIndex, 1);
      }

      for (let i = 0; i < newActions.length; i++) {
        newActions[i].order = i;
        sendArray.push({ _id: newActions[i]._id, order: i });
      }

      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}${API.ACTIONS}/reOrder`,
        {
          data: sendArray
        }
      );

      if (data?.success) {
        set({ actions: newActions });
      }
    },

    updateAction: async (_id: string, action: ActionData) => {
      const { data } = await axios.put(
        `${get().settings.macroDeck.baseUrl}${API.ACTIONS}/${_id}`,
        {
          data: JSON.stringify(action)
        }
      );

      if (data?.success) {
        const actionIndex = get().actions.findIndex(
          (item: Action) => item._id === _id
        );

        if (actionIndex > -1) {
          const newActions = [...get().actions];
          newActions[actionIndex].data = action;
          set({ actions: newActions, activeAction: newActions[actionIndex] });
        }
      }
    },

    fetchActions: async buttonPadId => {
      const id = buttonPadId || get().activeButtonPad?._id;
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}${API.ACTIONS}/${id}`
      );

      if (data?.success) {
        set({ actions: data.actions });
        const actionId = data.actions?.[0]?._id;

        if (actionId) {
          get().activateAction(actionId);
        }
      }
    },

    updateMobileDevice: async () => {
      await axios.get(`${get().settings.macroDeck.baseUrl}mobile/update`);
    },

    applyStyle: async (styleId: string, buttonPadNum: number) => {
      const buttonPad = get().buttonPads.find(
        (buttonPad: ButtonPad) =>
          buttonPad.buttonPadNum === buttonPadNum &&
          buttonPad.pageId === get().activePage?._id
      );

      const style = get().styles.find((style: Style) => style._id === styleId);

      if (!buttonPad || !style) return;

      const { data } = await axios.patch(
        `${get().settings.macroDeck.baseUrl}${API.BUTTON_PADS}/applyStyle`,
        {
          buttonPadId: buttonPad._id,
          ...style
        }
      );

      if (data.success) {
        const buttonPadIndex = get().buttonPads.findIndex(
          (button: ButtonPad) => button._id === buttonPad._id
        );

        if (buttonPadIndex > -1) {
          const newButtonPads = [...get().buttonPads];
          newButtonPads[buttonPadIndex].textColor = style.textColor;
          newButtonPads[buttonPadIndex].icon = style.icon;
          newButtonPads[buttonPadIndex].iconColor = style.iconColor;
          newButtonPads[buttonPadIndex].image = style.image;
          newButtonPads[buttonPadIndex].bgColor = style.bgColor;
          set({ buttonPads: newButtonPads });
        }
      }
    },

    createStyle: async (buttonPadNum: number) => {
      const buttonPad = get().buttonPads.find(
        (item: ButtonPad) => item.buttonPadNum === Number(buttonPadNum)
      );

      if (!buttonPad) return;

      const styleCheck = get().styles.find(
        (item: Style) =>
          item.textColor === buttonPad.textColor &&
          item.icon === buttonPad.icon &&
          item.iconColor === buttonPad.iconColor &&
          item.image === buttonPad.image &&
          item.bgColor === buttonPad.bgColor
      );

      if (styleCheck) return;

      const { data } = await axios.post(
        `${get().settings.macroDeck.baseUrl}${API.STYLE}`,
        {
          textColor: buttonPad.textColor,
          icon: buttonPad.icon,
          iconColor: buttonPad.iconColor,
          image: buttonPad.image,
          bgColor: buttonPad.bgColor
        }
      );

      if (data.success) {
        set({ styles: [...get().styles, data.style] });
      }
    },

    fetchStyles: async () => {
      const { data } = await axios.get(
        `${get().settings.macroDeck.baseUrl}${API.STYLE}`
      );

      if (data.success) {
        set({ styles: data.styles });
      }
    },

    removeStyle: async (_id: string) => {
      const { data } = await axios.delete(
        `${get().settings.macroDeck.baseUrl}${API.STYLE}/${_id}`
      );

      if (data.success) {
        const filteredStyles = get().styles.filter(
          (item: Style) => item._id !== _id
        );

        set({ styles: filteredStyles });
      }
    },

    // actions / actions    ////////////////////////////////////////////////////////////

    // dropzones / dropzones    ////////////////////////////////////////////////////////
    clearDropZones: () => {
      set({
        dropZones: {
          actionList: false,
          buttonPads: false,
          sideBarProfiles: false,
          sideBarStyles: false,
          styleHeader: false
        }
      });
    },

    setDropZone: (dropZone, status) => {
      set({
        dropZones: {
          ...get().dropZones,
          [dropZone]: status
        }
      });
    }
    // dropzones / dropzones    ////////////////////////////////////////////////////////
  })
);
