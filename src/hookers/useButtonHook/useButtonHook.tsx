import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

type ActivateButtonPad = (_id: string) => void;
type CopyButtonPad = (_id: string) => void;
type CreateButtonPad = (buttonPadNum: number) => void;
type DeleteButtonPad = (_id: string) => void;
type ReadButtonPads = any[];
type SetButtonPads = any;

type PasteButtonPad = (destinationPadId: string) => void;
type PlayButtonActions = (buttonPadId: string) => void;

type SwapButtonPads = (
  sourcePadNumber: number,
  destinationPadNumber: number
) => void;

type OverWriteButtonPads = (
  sourcePadNumber: number,
  destinationPadNumber: number
) => void;

export interface IntUseButtonPadsHook {
  activateButtonPad: ActivateButtonPad;
  copyButtonPad: CopyButtonPad;
  createButtonPad: CreateButtonPad;
  deleteButtonPad: DeleteButtonPad;
  overWriteButtonPads: OverWriteButtonPads;
  pasteButtonPad: PasteButtonPad;
  playButtonActions: PlayButtonActions;
  readButtonPads: ReadButtonPads;
  readButtonPadByNumber: any;
  setButtonPads: () => SetButtonPads;
  updateButtonPad: any;
  swapButtonPads: SwapButtonPads;
}

const useButtonHook = (): IntUseButtonPadsHook => {
  const globalDataStore = useGlobalDataStore(
    (state: Partial<IGlobalDataStore>) => state
  );

  const activateButtonPad: ActivateButtonPad = _id => {
    globalDataStore?.activateButtonPad &&
      globalDataStore.activateButtonPad(_id);
  };

  const copyButtonPad: CopyButtonPad = _id => {
    globalDataStore?.copyButtonPad && globalDataStore.copyButtonPad(_id);
  };

  const createButtonPad: CreateButtonPad = buttonPadNum => {
    globalDataStore?.createButtonPad &&
      globalDataStore.createButtonPad(buttonPadNum);
  };

  const deleteButtonPad: DeleteButtonPad = _id => {
    globalDataStore?.removeButtonPad && globalDataStore.removeButtonPad(_id);
  };

  const pasteButtonPad: PasteButtonPad = destinationPadId => {
    globalDataStore?.pasteButtonPad &&
      globalDataStore.pasteButtonPad(destinationPadId);
  };

  const playButtonActions: PlayButtonActions = buttonPadId => {
    globalDataStore?.playButtonActions &&
      globalDataStore.playButtonActions(buttonPadId);
  };

  const readButtonPads: ReadButtonPads = globalDataStore?.buttonPads
    ? globalDataStore.buttonPads
    : [];

  const readButtonPadByNumber = (buttonPadNumber: number) => {
    if (!globalDataStore?.buttonPads) return null;

    const buttonPad = globalDataStore.buttonPads.find(
      (button: any) => button.buttonPadNum === buttonPadNumber
    );

    return buttonPad;
  };

  const setButtonPads: SetButtonPads = () => {
    globalDataStore?.fetchButtonPads && globalDataStore.fetchButtonPads();
  };

  const updateButtonPad = (buttonPad: any) => {
    globalDataStore?.updateButtonPad &&
      globalDataStore.updateButtonPad(buttonPad);
  };

  const swapButtonPads: SwapButtonPads = (
    sourcePadNumber,
    destinationPadNumber
  ) => {
    globalDataStore?.swapButtonPads &&
      globalDataStore.swapButtonPads(sourcePadNumber, destinationPadNumber);
  };

  const overWriteButtonPads: OverWriteButtonPads = (
    sourcePadNumber,
    destinationPadNumber
  ) => {
    globalDataStore?.overWriteButtonPads &&
      globalDataStore.overWriteButtonPads(
        sourcePadNumber,
        destinationPadNumber
      );
  };

  return {
    activateButtonPad,
    copyButtonPad,
    createButtonPad,
    deleteButtonPad,
    overWriteButtonPads,
    pasteButtonPad,
    playButtonActions,
    readButtonPads,
    readButtonPadByNumber,
    setButtonPads,
    swapButtonPads,
    updateButtonPad
  };
};

export default useButtonHook;
