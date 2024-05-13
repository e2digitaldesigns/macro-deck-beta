import * as React from "react";
import { IMDSettings } from "../../types_";
import { useSettings } from "../../hookers";
import * as Styled from "./settingsForms.styles";
import ObsSettingsForms from "./settingsForms/obsSettings/obsSettings";

const SettingsForms: React.FC = () => {
  const { macroDeckSetting, updateMaroDeckSettings } = useSettings();

  const [settingsMD, setSettingsMD] = React.useState<IMDSettings>({
    ipAddress: "",
    port: ""
  });

  React.useEffect(() => {
    if (macroDeckSetting) {
      setSettingsMD({
        ipAddress: macroDeckSetting.ipAddress,
        port: macroDeckSetting.port
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSettingsMD({ ...settingsMD, [name]: value });
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateMaroDeckSettings(settingsMD.port);
  };

  return (
    <Styled.FormWrapper>
      <Styled.FormScrollWrapper>
        <Styled.Section>
          <Styled.SectionHeader>MacroDeck Settings</Styled.SectionHeader>

          <Styled.FieldSet>
            <label htmlFor="ipAddress">IP Address:</label>
            <div>
              <Styled.TextField
                onChange={handleChange}
                disabled={true}
                value={settingsMD.ipAddress}
              />
            </div>
          </Styled.FieldSet>

          <Styled.FieldSet>
            <label htmlFor="port">Port: </label>
            <div>
              <Styled.TextField
                name="port"
                onChange={handleChange}
                value={settingsMD.port}
              />
            </div>
          </Styled.FieldSet>

          <Styled.FieldSet>
            <Styled.SubmitButton onClick={onSubmit}>Submit</Styled.SubmitButton>
          </Styled.FieldSet>
        </Styled.Section>

        <ObsSettingsForms />
      </Styled.FormScrollWrapper>
    </Styled.FormWrapper>
  );
};

export default SettingsForms;
