import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

export interface IntUseActiveHook {
  profile: any;
  page: any;
  pageNumber: number;
  buttonPad: any;
  action: any;
}

const useActiveHook = (): IntUseActiveHook => {
  const {
    activeProfile,
    activePage,
    activePageNumber,
    activeButtonPad,
    activeAction
  } = useGlobalDataStore((state: Partial<IGlobalDataStore>) => ({
    activeProfile: state.activeProfile,
    activePage: state.activePage,
    activePageNumber: state.activePageNumber,
    activeButtonPad: state.activeButtonPad,
    activeAction: state.activeAction
  }));

  return {
    profile: activeProfile,
    page: activePage,
    pageNumber: activePageNumber || 0,
    buttonPad: activeButtonPad,
    action: activeAction
  };
};

export default useActiveHook;
