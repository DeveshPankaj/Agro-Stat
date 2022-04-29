"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBarBasicExample = void 0;
const React = __importStar(require("react"));
const CommandBar_1 = require("@fluentui/react/lib/CommandBar");
const overflowProps = { ariaLabel: 'More commands' };
const CommandBarBasicExample = ({ dispatch }) => {
    const _items = [
        {
            key: 'uploadfile',
            text: 'File',
            iconProps: { iconName: 'Add' },
            preferMenuTargetAsEventTarget: true,
            onClick: (ev) => {
                // ev?.persist();
                dispatch({ type: 'SELECT_FILE', event: ev });
            },
        },
        {
            key: 'settings',
            text: 'Analysis',
            iconProps: { iconName: 'DatabaseSync' },
            // onClick: (ev) => {
            //   dispatch({type: 'OPEN_SETTINGS', event: ev})
            // },
            subMenuProps: {
                items: [
                    {
                        key: 'anova',
                        text: 'Anova',
                        iconProps: { iconName: 'StackColumnChart' },
                        onClick: (ev) => {
                            dispatch({ type: 'OPEN_SETTINGS', event: ev, payload: { key: 'Anova' } });
                        },
                    },
                    {
                        key: 'one-factor-analysis',
                        text: 'One Factor Analysis',
                        iconProps: { iconName: 'Financial' },
                        onClick: (ev) => {
                            dispatch({ type: 'OPEN_SETTINGS', event: ev, payload: { key: '1 Factor Analysis' } });
                        },
                    },
                    {
                        key: 'path-analysis',
                        text: 'Path Analysis',
                        iconProps: { iconName: 'GitGraph' },
                        onClick: (ev) => {
                            dispatch({ type: 'OPEN_SETTINGS', event: ev, payload: { key: 'Path Analysis' } });
                        },
                    },
                ],
            },
        },
        {
            key: 'run',
            text: 'Run',
            iconProps: { iconName: 'Play' },
            onClick: (ev) => dispatch({ type: 'RUN', event: ev }),
        },
    ];
    const _overflowItems = [
        { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
        { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
        { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
    ];
    const _farItems = [
        {
            key: 'tile',
            text: 'Grid view',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Grid view',
            iconOnly: true,
            iconProps: { iconName: 'Tiles' },
            onClick: (ev) => dispatch({ type: 'TILE_VIEW', event: ev }),
        },
        {
            key: 'info',
            text: 'Info',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: (ev) => dispatch({ type: 'SHOW_INFO', event: ev }),
        },
    ];
    return (React.createElement(React.Fragment, null,
        React.createElement(CommandBar_1.CommandBar, { className: 'ms-depth-4', items: _items, overflowItems: _overflowItems, overflowButtonProps: overflowProps, farItems: _farItems, ariaLabel: "Inbox actions", primaryGroupAriaLabel: "Email actions", farItemsGroupAriaLabel: "More actions" })));
};
exports.CommandBarBasicExample = CommandBarBasicExample;
//# sourceMappingURL=index.js.map