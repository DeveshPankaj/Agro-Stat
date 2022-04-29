import {
  CommandBar,
  ICommandBarItemProps,
  ICommandBarProps,
  PanelType,
} from "@fluentui/react";
import React from "react";
import { PanelContext } from "../../contexts/Panel";
import { Settings } from "../../pages/Forms/Settings";


export type CommandBarProps = {
  dispatch(type: string): void
};
export const CommandBarComponent: React.FC<CommandBarProps> = ({dispatch}) => {
  const [actions, setActions] = React.useState<Array<ICommandBarItemProps>>([]);

  const panelCtx = React.useContext(PanelContext)

  React.useEffect(() => {
    setActions([
      // {
      //   key: "upload",
      //   text: "File",
      //   iconProps: { iconName: "Upload" },
      //   preferMenuTargetAsEventTarget: true,
      //   onClick: () => dispatch('upload')
      // },
      // {
      //   key: "analyse",
      //   text: "Analyse",
      //   iconProps: { iconName: "Processing" },
      //   preferMenuTargetAsEventTarget: true,
      //   subMenuProps: {
      //     items: [
      //       {
      //         key: "anova",
      //         text: "Anova",
      //         iconProps: { iconName: "StackColumnChart" },
      //         onClick: (ev) => dispatch('anova'),
      //       },
      //       {
      //         key: "one-factor-analysis",
      //         text: "One Factor Analysis",
      //         iconProps: { iconName: "Financial" },
      //         onClick: (ev) =>  dispatch('one-factor-analysis'),
      //       },
      //       {
      //         key: "path-analysis",
      //         text: "Path Analysis",
      //         iconProps: { iconName: "GitGraph" },
      //         onClick: (ev) =>  dispatch('path-analysis'),
      //       },
      //     ],
      //   },
      // },
    ]);
  }, []);


const _farItems: ICommandBarItemProps[] = [
  {
    key: 'tile',
    text: 'Dev tools',
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Dev tools',
    iconOnly: true,
    iconProps: { iconName: 'WebAppBuilderFragment' },
    onClick: () => {
      panelCtx.open(<Settings/>, {headerText: 'Dev Tools', type: PanelType.smallFixedFar, })
    }
  }
];

  return <CommandBar className="ms-depth-4" items={actions} farItems={_farItems} />;
};
