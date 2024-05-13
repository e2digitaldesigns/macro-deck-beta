import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

// type CreateStyle = (
//   textColor: string,
//   icon: string,
//   iconColor: string,
//   image: string,
//   bgColor: string
// ) => void;

type CreateStyle = (buttonPadNum: number) => void;

type DeleteStyle = (_id: string) => void;
type ReadStyles = any[];
type SetStyles = () => void;
type ApplyStyle = (styleId: string, buttonPadNum: number) => void;

export interface IntUseStylesHook {
  applyStyle: ApplyStyle;
  createStyle: CreateStyle;
  deleteStyle: DeleteStyle;
  readStyles: ReadStyles;
  setStyles: SetStyles;
}

const useStylesHook = (): IntUseStylesHook => {
  const { applyStyling, createStyling, fetchStyles, removeStyle, styles } =
    useGlobalDataStore((state: Partial<IGlobalDataStore>) => ({
      applyStyling: state.applyStyle,
      createStyling: state.createStyle,
      fetchStyles: state.fetchStyles,
      removeStyle: state.removeStyle,
      styles: state.styles
    }));

  const applyStyle: ApplyStyle = (styleId, buttonPadNum) => {
    return applyStyling && applyStyling(styleId, buttonPadNum);
  };

  const createStyle: CreateStyle = buttonPadNum => {
    return createStyling && createStyling(buttonPadNum);
  };

  const setStyles: SetStyles = () => {
    return fetchStyles && fetchStyles();
  };

  const readStyles: ReadStyles = styles ? styles : [];

  const deleteStyle: DeleteStyle = _id => {
    removeStyle && removeStyle(_id);
  };

  return {
    applyStyle,
    createStyle,
    deleteStyle,
    readStyles,
    setStyles
  };
};

export default useStylesHook;
