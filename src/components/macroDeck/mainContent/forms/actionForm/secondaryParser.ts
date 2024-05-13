import _includes from "lodash/includes";
import _startsWith from "lodash/startsWith";
import { Action } from "../../../../../types_";

const subArray = [
  "mdPage",
  "mdProfile",
  "obsLayerHide",
  "obsLayerShow",
  "obsLayerToggle",
  "obsSceneChange",
  "mcAudioNext",
  "mcAudioPause",
  "mcAudioStop",
  "mcAudioPlay",
  "mcAudioPrev",
  "mcAudioMute",
  "mcAudioVolDown",
  "mcAudioVolUp"
];

const secondaryParser = (type: string, state: Action): boolean => {
  return (
    _startsWith(state?.action, type) && _includes(subArray, state?.subAction)
  );
};

export default secondaryParser;
