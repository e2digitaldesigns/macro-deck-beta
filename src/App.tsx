import React from "react";
import * as Styled from "./styles/global.style";
import { ApplicationContext } from "./context/context";

import ApplicationWrapper from "./components/application/applicationWrapper";
import SoundPlayer from "./components/soundPlayer/soundPlayer";
import { useSettings } from "./hookers";
import AppInit from "./AppInit";

const Starter: React.FC<{}> = () => {
  const { macroDeckSetting, setSettings } = useSettings();

  React.useEffect(() => {
    setSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return macroDeckSetting?.baseUrl ? (
    <>
      <AppInit />
      <ApplicationContext.ThemeProvider>
        <Styled.GlobalStyle />

        <SoundPlayer />
        <ApplicationWrapper />
      </ApplicationContext.ThemeProvider>
    </>
  ) : (
    <h1>loading</h1>
  );
};

export default Starter;
