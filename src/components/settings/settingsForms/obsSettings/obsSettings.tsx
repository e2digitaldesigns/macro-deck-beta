import * as React from "react";
import * as Styled from "../../settingsForms.styles";
import { ISettingsFeaturesObs } from "../../../../types_";

import { useObsPlugin } from "../../../../hookers";

const ObsSettingsForms: React.FC = () => {
  const { obsPluginSettings, obsPluginSettingsUpdate } = useObsPlugin();

  const [settings, setSettings] = React.useState<ISettingsFeaturesObs>({
    ipAddress: "",
    port: "",
    password: ""
  });

  React.useEffect(() => {
    let stillMounted = true;

    if (obsPluginSettings && stillMounted) {
      setSettings({
        ...settings,
        ipAddress: obsPluginSettings.ipAddress,
        port: obsPluginSettings.port,
        password: obsPluginSettings.password
      });
    }

    return () => {
      stillMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obsPluginSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    obsPluginSettingsUpdate(settings);
  };

  return (
    <Styled.Section2>
      <Styled.SectionHeader>OBS Settings</Styled.SectionHeader>

      <Styled.FieldSet>
        <label htmlFor="features.obs.ipAddress">IP Address: </label>
        <div>
          <Styled.TextField
            name="ipAddress"
            onChange={handleChange}
            value={settings.ipAddress}
          />
        </div>
      </Styled.FieldSet>

      <Styled.FieldSet>
        <label htmlFor="features.obs.port">Port:</label>

        <div>
          <Styled.TextField
            name="port"
            onChange={handleChange}
            value={settings.port}
          />
        </div>
      </Styled.FieldSet>

      <Styled.FieldSet>
        <label htmlFor="features.obs.password">Password (optional):</label>
        <div>
          <Styled.TextField
            name="password"
            onChange={handleChange}
            type="password"
            value={settings.password}
          />
        </div>
      </Styled.FieldSet>

      <Styled.FieldSet>
        <Styled.SubmitButton onClick={onSubmit}>Submit</Styled.SubmitButton>
      </Styled.FieldSet>
    </Styled.Section2>
  );
};

export default ObsSettingsForms;
