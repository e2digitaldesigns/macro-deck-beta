import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

type DeletePage = (_id: string) => void;

type ActivatePage = (_id: string) => void;
type ReadPages = any[];
type SetPage = () => void;

export interface IntUsePagesHook {
  activatePage: ActivatePage;
  createPage: any;
  deletePage: DeletePage;
  readPages: ReadPages;
  setPages: SetPage;
}

const usePagesHook = (): IntUsePagesHook => {
  const {
    pages,
    activatePage: activatePageStore,
    createPage: createPageStore,
    fetchPages,
    removePage
  } = useGlobalDataStore((state: Partial<IGlobalDataStore>) => ({
    pages: state.pages,
    activePage: state.activePage,
    activatePage: state.activatePage,
    createPage: state.createPage,
    fetchPages: state.fetchPages,
    removePage: state.removePage,
    state: state
  }));

  const activatePage: ActivatePage = _id => {
    activatePageStore && activatePageStore(_id);
  };

  const createPage: any = () => {
    createPageStore && createPageStore();
  };

  const readPages: ReadPages = pages ? pages : [];

  const setPages: SetPage = () => {
    return fetchPages && fetchPages();
  };

  const deletePage: DeletePage = _id => {
    removePage && removePage(_id);
  };

  return {
    activatePage,
    createPage,
    deletePage,
    readPages,
    setPages
  };
};

export default usePagesHook;
