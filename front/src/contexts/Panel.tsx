import { IPanelProps } from "@fluentui/react";
import React, { ReactNode } from "react";

export type PanelActions = {
  open(body: ReactNode,props: IPanelProps): void;
  close(): void
};

const defaultContext: PanelActions = {
    open() {},
    close() {}
};

export const PanelContext = React.createContext<PanelActions>(defaultContext);