import React, { ReactNode, useState } from "react";
import { CSVRender } from "./components/DataList";
import { CommandBarComponent } from "./components/Header";
import { Home } from "./pages/Home";
import { CSV } from "./services/DataService";
import { selectFile } from "./utils/fs";

import "./index.scss";
import { PanelContext } from "./contexts/Panel";
import { DefaultButton, IPanelProps, Panel, PanelType, PrimaryButton } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";


// const buttonStyles = { root: { marginRight: 8 } };


export type AppProps = {};
export const App: React.FC<AppProps> = () => {
  const [content, setContent] = React.useState<React.ReactNode>(<Home />);
  const commandHandler = React.useCallback(
    (type: string) => {
      console.log(type);
      if (type === "upload") {
        _loadCsv().then(() => {
            panelDispatch(<CSVRender csv={CSV} />, {
                headerText: "Data Preview",
                type: PanelType.medium,
                onRenderFooterContent: () => {
                  return (
                    <div>
                      <DefaultButton onClick={dismissPanel}>Close</DefaultButton>
                    </div>
                  );
                },
              });
        })
      }

      if (type === "anova") {
        setContent(<CSVRender csv={CSV} />);
      }
    },
    [setContent]
  );

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [panelBody, setPanelBody] = useState<ReactNode>(null);
  const [panelProps, setPanelProps] = React.useState<IPanelProps>({});
  const panelDispatch = React.useCallback(
    (body: ReactNode, props: IPanelProps) => {
      setPanelBody(body);
      setPanelProps(props);
      openPanel();
    },
    [panelBody, isOpen, panelProps]
  );
  return (
    <>
      <PanelContext.Provider
        value={{ open: panelDispatch, close: dismissPanel }}
      >
        <div className="ms-Fabric" dir="ltr">
          <div className="ms-Grid">
            <div
              className="ms-Grid-row"
              style={{ position: "sticky", top: "0", zIndex: 100 }}
            >
              <CommandBarComponent dispatch={commandHandler} />
            </div>
            <Panel
              //   type={PanelType.medium}
              isFooterAtBottom={true}
              closeButtonAriaLabel="Close"
              {...panelProps}
              isOpen={isOpen}
              onDismiss={dismissPanel}
            >
              {panelBody}
            </Panel>

            {content}
          </div>
        </div>
      </PanelContext.Provider>
    </>
  );
};

function _loadCsv() {
  return new Promise<void>((resolve) => {
    selectFile().then((file) => {
      if (!file) return;
      const chunk = file.slice(0, 1024);

      const csv: Array<Array<string>> = [];

      let str = "";
      const reader = new FileReader();
      reader.addEventListener("load", function (e) {
        str = (e?.target?.result as string) || "";

        const lines = str.split("\n");

        const header = lines[0].split(",").map((x) => x.trim());
        csv.push(header);

        for (let i = 1; i < lines.length; i++) {
          if (!lines[0].length) break;
          let line = lines[i].split(",").map((x) => x.trim());
          csv.push(line);
        }
        CSV.next(csv);
        resolve();
      });
      reader.readAsBinaryString(chunk);
    });
  });
}
