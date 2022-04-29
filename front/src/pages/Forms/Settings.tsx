import {
  DefaultButton,
  IStackProps,
  IStackStyles,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import React from "react";

const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};

const buttonStyles = { root: { marginRight: 8 } };

export type SettingsProps = {};
export const Settings: React.FC<SettingsProps> = () => {
  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      <Stack {...columnProps}>
        <TextField label="Configurator url" required />
        {/* <TextField label="Standard" /> */}
      </Stack>
      <div>
        <PrimaryButton styles={buttonStyles}>Save</PrimaryButton>
        <DefaultButton>Cancel</DefaultButton>
      </div>
    </Stack>
  );
};
