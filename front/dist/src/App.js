"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.ProgressIndicatorBasicExample = exports.ButtonDefaultExample = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("@fluentui/react");
const Button_1 = require("@fluentui/react/lib/Button");
const buffer_1 = require("buffer");
require("./index.scss");
const ProgressIndicator_1 = require("@fluentui/react/lib/ProgressIndicator");
const Header_1 = require("./components/Header");
const DataList_1 = require("./components/DataList");
const DataService_1 = require("./services/DataService");
const PanelService_1 = require("./services/PanelService");
(0, react_2.initializeIcons)();
// Example formatting
const stackTokens = { childrenGap: 40 };
const buttonStyles = { root: { marginRight: 8 } };
const ButtonDefaultExample = (props) => {
    const { disabled, checked } = props;
    return (react_1.default.createElement(react_2.Stack, { horizontal: true, tokens: stackTokens },
        react_1.default.createElement(Button_1.DefaultButton, { text: "Standard", onClick: _alertClicked, allowDisabledFocus: true, disabled: disabled, checked: checked }),
        react_1.default.createElement(Button_1.PrimaryButton, { text: "Primary", onClick: _alertClicked, allowDisabledFocus: true, disabled: disabled, checked: checked })));
};
exports.ButtonDefaultExample = ButtonDefaultExample;
function _alertClicked() {
    // alert('Clicked');
    const input = document.createElement("input");
    input.style.display = "hidden";
    input.type = "file";
    input.onchange = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
        // @ts-ignore
        const fileStream = file.stream().getReader();
        const chunk = yield fileStream.read(100);
        const csv = [];
        const str = buffer_1.Buffer.from(chunk.value).toString();
        const lines = str.split("\n");
        const header = lines[0].split(",").map((x) => x.trim());
        csv.push(header);
        for (let i = 1; i < lines.length; i++) {
            if (!lines[0].length)
                break;
            let line = lines[i].split(",").map((x) => x.trim());
            csv.push(line);
        }
        // console.log(csv)
        DataService_1.CSV.next(csv);
    });
    input.click();
}
const searchBoxStyles = { root: { width: 200 } };
const intervalDelay = 100;
const intervalIncrement = 0.01;
const ProgressIndicatorBasicExample = () => {
    const [percentComplete, setPercentComplete] = react_1.default.useState(0);
    react_1.default.useEffect(() => {
        const id = setInterval(() => {
            setPercentComplete((intervalIncrement + percentComplete) % 1);
        }, intervalDelay);
        return () => {
            clearInterval(id);
        };
    });
    return react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { percentComplete: percentComplete });
};
exports.ProgressIndicatorBasicExample = ProgressIndicatorBasicExample;
const addFriendIcon = { iconName: "AddFriend" };
const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
};
const dropdownStyles = {
    dropdown: { width: 300 },
};
const App = ({}) => {
    const [content, setContent] = react_1.default.useState(react_1.default.createElement(DataList_1.CSVRender, { csv: DataService_1.CSV }));
    const [options, setOptions] = react_1.default.useState([]);
    react_1.default.useEffect(() => {
        const subscription = DataService_1.CSV.subscribe((csv) => {
            const header = csv[0] || [];
            let _options = header.map((x) => ({
                key: x.replace(/^\"+|\"+$/g, ''),
                text: x.replace(/^\"+|\"+$/g, '')
            }));
            setOptions(_options);
            console.log(_options);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    const [formData, setFormData] = react_1.default.useState({
        rep: '3',
        gen: '',
        traits: ['']
    });
    const commandBarDispatchHandeler = react_1.default.useCallback((event) => {
        var _a;
        switch (event.type) {
            case "OPEN_SETTINGS":
                PanelService_1.panel.open({
                    title: (((_a = event === null || event === void 0 ? void 0 : event.payload) === null || _a === void 0 ? void 0 : _a.key) || 'Config'),
                    onSave: (data) => {
                        console.log(formData);
                    },
                    content: (react_1.default.createElement(react_1.default.Fragment, null,
                        options.length === 0 ?
                            react_1.default.createElement("code", { style: { color: 'red' } }, "No file selected!") : null,
                        react_1.default.createElement(react_2.Stack, Object.assign({}, columnProps),
                            react_1.default.createElement(react_2.TextField, { label: "Rep", placeholder: "Rep count", defaultValue: formData.rep, type: "number", onChange: (event, value) => setFormData(Object.assign(Object.assign({}, formData), { rep: value || '' })) }),
                            react_1.default.createElement(react_2.Dropdown, { placeholder: "column name", label: "Gen", options: options, styles: dropdownStyles, onChange: (event, option) => setFormData(Object.assign(Object.assign({}, formData), { gen: (option === null || option === void 0 ? void 0 : option.text) || '' })) }),
                            react_1.default.createElement(Button_1.DefaultButton, { label: "Add trait", onClick: () => setFormData(Object.assign(Object.assign({}, formData), { traits: Object.assign(Object.assign({}, formData.traits), { [formData.traits.length]: '' }) })) }),
                            formData.traits.map((x, i) => (react_1.default.createElement(react_2.Dropdown, { key: i, placeholder: "column name", label: "Trait", options: options, styles: dropdownStyles, onChange: (event, option) => setFormData(Object.assign(Object.assign({}, formData), { traits: Object.assign(Object.assign({}, formData.traits), { [i]: (option === null || option === void 0 ? void 0 : option.text) || '' }) })) })))))),
                    // navContent: <>
                    // hi
                    // </>
                });
                break;
            case "SELECT_FILE":
                _loadCsv();
                break;
            case "RUN":
                console.log(`Running ...`);
                break;
        }
    }, [options, formData]);
    return (react_1.default.createElement("div", { className: "ms-Fabric", dir: "ltr" },
        react_1.default.createElement("div", { className: "ms-Grid" },
            react_1.default.createElement("div", { className: "ms-Grid-row", style: { position: "sticky", top: "0", zIndex: 100 } },
                react_1.default.createElement(Header_1.CommandBarBasicExample, { dispatch: commandBarDispatchHandeler })),
            react_1.default.createElement("div", { className: "ms-Grid-row" }, content)),
        react_1.default.createElement(PanelService_1.SharedPanel, null)));
};
exports.App = App;
function _loadCsv() {
    // alert('Clicked');
    const input = document.createElement("input");
    input.style.display = "hidden";
    input.type = "file";
    input.onchange = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
        const chunk = file.slice(0, 1024);
        const csv = [];
        let str = "";
        const reader = new FileReader();
        reader.addEventListener("load", function (e) {
            var _a;
            str = ((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.result) || "";
            const lines = str.split("\n");
            const header = lines[0].split(",").map((x) => x.trim());
            csv.push(header);
            for (let i = 1; i < lines.length; i++) {
                if (!lines[0].length)
                    break;
                let line = lines[i].split(",").map((x) => x.trim());
                csv.push(line);
            }
            DataService_1.CSV.next(csv);
        });
        reader.readAsBinaryString(chunk);
    });
    input.click();
}
//# sourceMappingURL=App.js.map