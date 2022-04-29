import {
  ActionButton,
  CompoundButton,
  DefaultButton,
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownStyles,
  IStackTokens,
  PanelType,
  PrimaryButton,
  Separator,
  Stack,
} from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import React from "react";
import { CSVRender } from "../../components/DataList";
import { PanelContext } from "../../contexts/Panel";
import { CSV } from "../../services/DataService";
import { AnovaForm } from "../Forms/Anova";

const tokens: { sectionStack: IStackTokens; headingStack: IStackTokens } = {
  sectionStack: {
    childrenGap: 10,
    padding: "1rem",
  },
  headingStack: {
    childrenGap: 5,
  },
};

const buttonStyles = { root: { marginRight: 8 } };

const options: IDropdownOption[] = [
  { key: "anova", text: "Anova" },
  { key: "one-factor-analysis", text: "One Factor Analysis" },
  { key: "path-analysis", text: "Path Analysis" },
];

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

export type HomeProps = {};
export const Home: React.FC<HomeProps> = () => {
  const panelCtx = React.useContext(PanelContext);
  const [options, setOptions] = React.useState<Array<IDropdownOption>>([])

  React.useEffect(() => {
    fetch('http://127.0.0.1:81', {})
    .then(result => 
      result.json()  as Promise<Array<{_id: string, code: string, name: string, description: string}>>
      )
    .then(result => {
      setOptions(result.map(x => ({key: x.name, text: x.description})))
    })
  }, [])

  const openPanel = () => {
    panelCtx.open(<CSVRender csv={CSV} />, {
      headerText: "Data Preview",
      type: PanelType.medium,
      onRenderFooterContent: () => {
        return (
          <div>
            <PrimaryButton styles={buttonStyles}>Save</PrimaryButton>
            <DefaultButton onClick={panelCtx.close}>Cancel</DefaultButton>
          </div>
        );
      },
    });
  };

  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>(
    options[0]!
  );
  const [form, setForm] = React.useState<React.ReactNode>();

  const onselectionchange = React.useCallback(
    (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption) => {
      setSelectedItem(item!);
    },
    [selectedItem]
  );

  React.useEffect(() => {
    if (selectedItem && selectedItem.key === "anova") {
      setForm(<AnovaForm />);
    } else {
      setForm(undefined);
    }
  }, [selectedItem]);

  return (
    <>
      <Stack tokens={tokens.sectionStack}>
        <Dropdown
          placeholder="Select options"
          label="Select Analysis"
          selectedKey={selectedItem ? selectedItem.key : undefined}
          options={options}
          styles={dropdownStyles}
          onChange={onselectionchange}
        />
        <Separator />

        {form}
      </Stack>
    </>
  );
};
