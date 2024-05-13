import React from "react";
import * as Styled from "./footer.style";
import { useSettings } from "./../../../hookers";

export const TemplateFooter: React.FC = () => {
  const { macroDeckSetting } = useSettings();

  return (
    <Styled.Footer>
      <Styled.FooterTab>
        port:
        <span>{macroDeckSetting?.port || "n/a"}</span>
      </Styled.FooterTab>

      <Styled.FooterTab>
        ip address:
        <span>{macroDeckSetting?.ipAddress || "n/a"}</span>
      </Styled.FooterTab>
    </Styled.Footer>
  );
};
