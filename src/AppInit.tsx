import React from "react";

import {
  useAction,
  useActive,
  useButtonPad,
  useObsPlugin,
  usePage,
  useProfile,
  useStyle
} from "./hookers";

const AppInit: React.FC<{}> = () => {
  const { setPages } = usePage();
  const { buttonPad, page, profile } = useActive();
  const { setProfiles } = useProfile();
  const { setButtonPads } = useButtonPad();
  const { setActions } = useAction();
  const { setPluginObs } = useObsPlugin();

  const { setStyles } = useStyle();

  React.useEffect(() => {
    setProfiles();
    setStyles();
    setPluginObs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  React.useEffect(() => {
    setButtonPads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  React.useEffect(() => {
    setActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonPad]);

  return null;
};

export default AppInit;
