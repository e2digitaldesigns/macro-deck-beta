import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

type ActivateAction = (_id: string) => void;
type DeleteAction = (_id: string) => void;
type ReadActions = any[];
type ReOrderActions = (dragId: string, dropId: string) => void;
type SetActions = () => void;
type UpdateAction = (_id: string, action: any) => void;

export interface IntUseActionsHook {
  activateAction: ActivateAction;
  createAction: any;
  deleteAction: DeleteAction;
  readActions: ReadActions;
  reOrderActions: ReOrderActions;
  setActions: SetActions;
  updateAction: UpdateAction;
}

const useActionHook = (): IntUseActionsHook => {
  const globalDataStore = useGlobalDataStore(
    (state: Partial<IGlobalDataStore>) => state
  );

  const activateAction: ActivateAction = _id => {
    globalDataStore?.activateAction && globalDataStore.activateAction(_id);
  };

  const createAction: DeleteAction = () => {
    globalDataStore?.createAction && globalDataStore.createAction();
  };

  const deleteAction: DeleteAction = _id => {
    globalDataStore?.removeAction && globalDataStore.removeAction(_id);
  };

  const readActions: ReadActions = globalDataStore?.actions
    ? globalDataStore.actions
    : [];

  const reOrderActions: ReOrderActions = (dragId, dropId) => {
    globalDataStore?.reOrderActions &&
      globalDataStore.reOrderActions(dragId, dropId);
  };

  const setActions: SetActions = () => {
    globalDataStore?.fetchActions && globalDataStore.fetchActions();
  };

  const updateAction: UpdateAction = (_id, action) => {
    globalDataStore?.updateAction && globalDataStore.updateAction(_id, action);
  };

  return {
    activateAction,
    createAction,
    deleteAction,
    readActions,
    reOrderActions,
    setActions,
    updateAction
  };
};

export default useActionHook;
