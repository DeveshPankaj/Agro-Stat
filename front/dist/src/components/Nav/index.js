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
exports.NavBasicExample = void 0;
const React = __importStar(require("react"));
const Nav_1 = require("@fluentui/react/lib/Nav");
const navStyles = {
    root: {
        width: 208,
        height: 350,
        boxSizing: 'border-box',
        border: '1px solid #eee',
        overflowY: 'auto',
    },
};
const navLinkGroups = [
    {
        links: [
            {
                name: 'Home',
                url: 'http://example.com',
                expandAriaLabel: 'Expand Home section',
                collapseAriaLabel: 'Collapse Home section',
                links: [
                    {
                        name: 'Activity',
                        url: 'http://msn.com',
                        key: 'key1',
                        target: '_blank',
                    },
                    {
                        name: 'MSN',
                        url: 'http://msn.com',
                        disabled: true,
                        key: 'key2',
                        target: '_blank',
                    },
                ],
                isExpanded: true,
            },
            {
                name: 'Documents',
                url: 'http://example.com',
                key: 'key3',
                isExpanded: true,
                target: '_blank',
                links: []
            },
            {
                name: 'Pages',
                url: 'http://msn.com',
                key: 'key4',
                target: '_blank',
            },
            {
                name: 'Notebook',
                url: 'http://msn.com',
                key: 'key5',
                disabled: false,
            },
            {
                name: 'Communication and Media',
                url: 'http://msn.com',
                key: 'key6',
                target: '_blank',
            },
            {
                name: 'News',
                url: 'http://cnn.com',
                icon: 'News',
                key: 'key7',
                target: '_blank',
            },
        ],
    },
];
const NavBasicExample = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Nav_1.Nav, { onLinkClick: _onLinkClick, selectedKey: "key3", ariaLabel: "Nav basic example", styles: navStyles, groups: navLinkGroups })));
};
exports.NavBasicExample = NavBasicExample;
function _onLinkClick(ev, item) {
    if (item && item.name === 'News') {
        alert('News link clicked');
    }
}
//# sourceMappingURL=index.js.map