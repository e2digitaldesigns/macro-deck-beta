import React from "react";
import { useTheme } from "../../../hooks";
import { useElectron } from "../../../hookers";
import * as Styled from "../../../styles/app.style";
import * as themes from "../../../context/themeContext/themes";
import { IpcRendererTypes } from "../../../types_";

export const TemplateMainContent: React.FC = () => {
  const { setThemeState } = useTheme();
  const { ipcRender } = useElectron();

  const handleIpc = () => {
    ipcRender(IpcRendererTypes.Ping, { data: "data" });
  };

  return (
    <Styled.MainContent>
      <div>
        <h3 onClick={() => handleIpc()}>IPC Render</h3>
        <h2>Main</h2>
        <h2>Main</h2>
        <br />
        {/* <h3 onClick={() => setThemeState(themes.themeLight)}>Light</h3> */}
        <br />
        <h3 onClick={() => setThemeState(themes.themeDark)}>Dark</h3>
        <br />

        <br />
        <span>"🌙" : "🌞"</span>
        <h3 onClick={() => handleIpc()}>IPC Render</h3>
      </div>
    </Styled.MainContent>
  );
};
