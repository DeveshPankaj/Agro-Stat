"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedPanel = exports.panel = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("@fluentui/react");
const react_hooks_1 = require("@fluentui/react-hooks");
const rxjs_1 = require("rxjs");
const Panel_1 = require("@fluentui/react/lib/Panel");
const buttonStyles = { root: { marginRight: 8 } };
const searchboxStyles = {
    root: { margin: "5px", height: "auto", width: "100%" },
};
const panelEventBus = new rxjs_1.Subject();
exports.panel = {
    open: ({ content, title, onSave }) => panelEventBus.next({ type: "OPEN", content, title, onSave }),
    close: () => panelEventBus.next({ type: "CLOSE" }),
};
const SharedPanel = () => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = (0, react_hooks_1.useBoolean)(false);
    const [content, setContent] = react_1.default.useState(null);
    const [title, setTitle] = react_1.default.useState("");
    const saveCallback = react_1.default.useRef();
    react_1.default.useEffect(() => {
        const subscription = panelEventBus.subscribe(event => {
            if (event.type === 'OPEN') {
                setContent(event.content);
                saveCallback.current = event.onSave;
                setTitle(event.title || '');
                openPanel();
            }
            if (event.type === 'CLOSE') {
                dismissPanel();
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [openPanel, dismissPanel, setContent, setTitle]);
    const onSave = () => {
        if (saveCallback && saveCallback.current)
            saveCallback.current({});
        dismissPanel();
    };
    const onRenderFooterContent = react_1.default.useCallback(() => (react_1.default.createElement("div", null,
        react_1.default.createElement(react_2.PrimaryButton, { onClick: onSave, styles: buttonStyles }, "Save"),
        react_1.default.createElement(react_2.DefaultButton, { onClick: dismissPanel }, "Cancel"))), [dismissPanel, onSave]);
    return (react_1.default.createElement(react_2.Panel, { isOpen: isOpen, onDismiss: dismissPanel, headerText: title, closeButtonAriaLabel: "Close", onRenderFooterContent: onRenderFooterContent, type: Panel_1.PanelType.medium, 
        // Stretch panel content to fill the available height so the footer is positioned
        // at the bottom of the page
        isFooterAtBottom: true }, content));
};
exports.SharedPanel = SharedPanel;
//# sourceMappingURL=PanelService.js.map