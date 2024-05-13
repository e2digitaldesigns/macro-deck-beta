export interface IntProfile {
  _id: string;
  profileName: string;
  buttonPads: number;
}

export type IntProfileContextInterface = IntProfile[];

export interface IntProfileContextStateInterface {
  profileState: IntProfileContextInterface;
  setProfileState: React.Dispatch<
    React.SetStateAction<IntProfileContextInterface>
  >;
}
