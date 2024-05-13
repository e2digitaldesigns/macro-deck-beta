export enum IpcRendererTypes {
  database = "database",
  databaseMobileUpdate = "database:mobileUpdate",
  header = "header",
  mdPlaySound = "MacroDeck:playSound",
  Ping = "ping",
  soundBoardProfile = "soundBoardProfile:dialogueBox",
  soundBoardProfileReturn = "soundBoardProfile:dialogueBoxReturn",
  FetchMDSettings = "fetchMDSettings",
  FetchMDSettingsReturn = "fetchMDSettings:return"
}

export enum IpcRendererTypesAction {
  close = "close",
  fsToggle = "fsToggle",
  minimize = "minimize",
  loadAppData = "loadAppData",
  saveAppData = "saveAppData",
  updateMobileDevice = "updateMobileDevice"
}
