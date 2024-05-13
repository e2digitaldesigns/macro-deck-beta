export type ActionProps = {
  type: string;
  payload: any;
};

export type mdNames =
  | "mdHome"
  | "mdPage"
  | "mdProfile"
  | "mdProfileSelector"
  | "mdReset"
  | "mdSettings";

export interface mdActions {
  name: mdNames;
  profile: string;
  page: string;
  seconds: number;
}

export type Action = {
  _id: string;
  profileId: string;
  pageId: string;
  buttonPadId: string;
  order: number;
  actionSet: string;
  actionProps: any;
};
