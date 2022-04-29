import React from "react";
import {
  Stack,
  IStackTokens,
  initializeIcons,
  Panel,
  PrimaryButton,
  DefaultButton,
  IRenderFunction,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { Subject } from "rxjs";
import { IPanelProps, PanelType } from "@fluentui/react/lib/Panel";
import { SearchBox } from "@fluentui/react/lib/SearchBox";

const buttonStyles = { root: { marginRight: 8 } };
const searchboxStyles = {
  root: { margin: "5px", height: "auto", width: "100%" },
};

type PanelEventType = "OPEN" | "CLOSE";
const panelEventBus = new Subject<{
  type: PanelEventType;
  content?: React.ReactNode;
  title?: string;
  onSave?: (data: any) => void
}>();

export const panel = {
  open: ({
    content,
    title,
    onSave
  }: {
    content: React.ReactNode
    title?: string
    navContent?: React.ReactNode
    onSave?: (data: any) => any
  }) => panelEventBus.next({ type: "OPEN", content, title, onSave}),
  close: () => panelEventBus.next({ type: "CLOSE" }),
};

export const SharedPanel: React.FC<{}> = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [title, setTitle] = React.useState<string>("");
  const saveCallback = React.useRef<Function>()


  React.useEffect(() => {
    const subscription = panelEventBus.subscribe(event => {
      if(event.type === 'OPEN') {
        setContent(event.content)
        saveCallback.current = event.onSave
        setTitle(event.title || '')
        openPanel()
      }

      if(event.type === 'CLOSE') {
        dismissPanel()
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }

  }, [openPanel, dismissPanel, setContent, setTitle])


  const onSave = () => {

    if(saveCallback && saveCallback.current) saveCallback.current({})
    dismissPanel()

  }

  

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={onSave} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel, onSave]
  );

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={dismissPanel}
      headerText={title}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={onRenderFooterContent}
      type={PanelType.medium}
      // Stretch panel content to fill the available height so the footer is positioned
      // at the bottom of the page
      isFooterAtBottom={true}
    >
      {content}
    </Panel>
  );
};
