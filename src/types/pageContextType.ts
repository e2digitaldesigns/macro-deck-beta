export interface IntPage {
  _id: string;
  profileId: string;
  order: number;
}

export type IntPageContextInterface = IntPage[];

export interface IntPageContextStateInterface {
  pageState: IntPageContextInterface;
  setPageState: React.Dispatch<React.SetStateAction<IntPageContextInterface>>;
}
