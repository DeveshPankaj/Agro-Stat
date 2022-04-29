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
exports.CSVRender = exports.DetailsListDocumentsExample = void 0;
const React = __importStar(require("react"));
const DetailsList_1 = require("@fluentui/react/lib/DetailsList");
const Styling_1 = require("@fluentui/react/lib/Styling");
const DataService_1 = require("../../services/DataService");
const classNames = (0, Styling_1.mergeStyleSets)({
    fileIconHeaderIcon: {
        padding: 0,
        fontSize: '16px',
    },
    fileIconCell: {
        textAlign: 'center',
        selectors: {
            '&:before': {
                content: '.',
                display: 'inline-block',
                verticalAlign: 'middle',
                height: '100%',
                width: '0px',
                visibility: 'hidden',
            },
        },
    },
    fileIconImg: {
        verticalAlign: 'middle',
        maxHeight: '16px',
        maxWidth: '16px',
    },
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    exampleToggle: {
        display: 'inline-block',
        marginBottom: '10px',
        marginRight: '30px',
    },
    selectionDetails: {
        marginBottom: '20px',
    },
});
class DetailsListDocumentsExample extends React.Component {
    constructor(props) {
        super(props);
        this._onColumnClick = (ev, column) => {
            const { columns, items } = this.state;
            const newColumns = columns.slice();
            const currColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
            newColumns.forEach((newCol) => {
                if (newCol === currColumn) {
                    currColumn.isSortedDescending = !currColumn.isSortedDescending;
                    currColumn.isSorted = true;
                    this.setState({
                        announcedMessage: `${currColumn.name} is sorted ${currColumn.isSortedDescending ? 'descending' : 'ascending'}`,
                    });
                }
                else {
                    newCol.isSorted = false;
                    newCol.isSortedDescending = true;
                }
            });
            const newItems = _copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
            this.setState({
                columns: newColumns,
                items: newItems,
            });
        };
        this._allItems = [] || _generateDocuments();
        const columns = [
        // {
        //   key: 'column1',
        //   name: 'File Type',
        //   className: classNames.fileIconCell,
        //   iconClassName: classNames.fileIconHeaderIcon,
        //   ariaLabel: 'Column operations for File type, Press to sort on File type',
        //   iconName: 'Page',
        //   isIconOnly: true,
        //   fieldName: 'name',
        //   minWidth: 16,
        //   maxWidth: 16,
        //   onColumnClick: this._onColumnClick,
        //   onRender: (item: IDocument, index) => (
        //     <TooltipHost content={`${item.fileType} file`}>
        //       <img src={item.iconName} className={classNames.fileIconImg} alt={`${item.fileType} file icon`} />
        //     </TooltipHost>
        //   ),
        // },
        // {
        //   key: 'column2',
        //   name: 'Name',
        //   fieldName: 'name',
        //   minWidth: 210,
        //   maxWidth: 350,
        //   isRowHeader: true,
        //   isResizable: true,
        //   isSorted: true,
        //   isSortedDescending: false,
        //   sortAscendingAriaLabel: 'Sorted A to Z',
        //   sortDescendingAriaLabel: 'Sorted Z to A',
        //   onColumnClick: this._onColumnClick,
        //   data: 'string',
        //   isPadded: true,
        // },
        // {
        //   key: 'column3',
        //   name: 'Date Modified',
        //   fieldName: 'dateModifiedValue',
        //   minWidth: 70,
        //   maxWidth: 90,
        //   isResizable: true,
        //   onColumnClick: this._onColumnClick,
        //   data: 'number',
        //   onRender: (item: IDocument) => {
        //     return <span>{item.dateModified}</span>;
        //   },
        //   isPadded: true,
        // },
        // {
        //   key: 'column4',
        //   name: 'Modified By',
        //   fieldName: 'modifiedBy',
        //   minWidth: 70,
        //   maxWidth: 90,
        //   isResizable: true,
        //   isCollapsible: true,
        //   data: 'string',
        //   onColumnClick: this._onColumnClick,
        //   onRender: (item: IDocument) => {
        //     return <span>{item.modifiedBy}</span>;
        //   },
        //   isPadded: true,
        // },
        // {
        //   key: 'column5',
        //   name: 'File Size',
        //   fieldName: 'fileSizeRaw',
        //   minWidth: 70,
        //   maxWidth: 90,
        //   isResizable: true,
        //   isCollapsible: true,
        //   data: 'number',
        //   onColumnClick: this._onColumnClick,
        //   onRender: (item: IDocument) => {
        //     return <span>{item.fileSize}</span>;
        //   },
        // },
        ];
        DataService_1.CSV.subscribe(data => {
            console.log(data);
            columns.length = 0;
            for (const column of data[0]) {
                columns.push({
                    key: column,
                    name: column,
                    fieldName: column,
                    minWidth: 210,
                    maxWidth: 350,
                    isRowHeader: true,
                    isResizable: true,
                    isSorted: true,
                    isSortedDescending: false,
                    sortAscendingAriaLabel: 'Sorted A to Z',
                    sortDescendingAriaLabel: 'Sorted Z to A',
                    onColumnClick: this._onColumnClick,
                    data: 'string',
                    isPadded: true,
                });
            }
            const header = data[0];
            const items = [];
            for (let i = 1; i < data.length; i++) {
                let row = data[i];
                let obj = header.reduce((prev, curr, j) => {
                    prev[curr] = row[j];
                    return prev;
                }, {});
                items.push(obj);
            }
            this.setState({
                items: items
            });
        });
        this._selection = new DetailsList_1.Selection({
            onSelectionChanged: () => {
                this.setState({
                    selectionDetails: this._getSelectionDetails(),
                });
            },
        });
        this.state = {
            items: this._allItems,
            columns: columns,
            selectionDetails: this._getSelectionDetails(),
            isModalSelection: false,
            isCompactMode: true,
            announcedMessage: undefined,
        };
    }
    componentDidMount() {
    }
    render() {
        const { columns, isCompactMode, items, selectionDetails, isModalSelection, announcedMessage } = this.state;
        return (React.createElement("div", { style: { margin: '1rem' }, className: "ms-depth-4" },
            React.createElement(DetailsList_1.DetailsList, { items: items, compact: isCompactMode, columns: columns, selectionMode: DetailsList_1.SelectionMode.none, getKey: this._getKey, setKey: "none", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, isHeaderVisible: true, onItemInvoked: this._onItemInvoked })));
    }
    componentDidUpdate(previousProps, previousState) {
        if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
            this._selection.setAllSelected(false);
        }
    }
    _getKey(item, index) {
        return item.key;
    }
    _onItemInvoked(item) {
        alert(`Item invoked: ${item.name}`);
    }
    _getSelectionDetails() {
        const selectionCount = this._selection.getSelectedCount();
        switch (selectionCount) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ' + this._selection.getSelection()[0].name;
            default:
                return `${selectionCount} items selected`;
        }
    }
}
exports.DetailsListDocumentsExample = DetailsListDocumentsExample;
function _copyAndSort(items, columnKey, isSortedDescending) {
    const key = columnKey;
    return items.slice(0).sort((a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
function _generateDocuments() {
    const items = [];
    let d = _randomDate(new Date(2012, 0, 1), new Date());
    let f = _randomFileSize();
    // items.push({
    //   key: 'key1',
    //   name: 'Lorem',
    //   value: 'file',
    //   iconName: _randomFileIcon().url,
    //   fileType: _randomFileIcon().docType,
    //   modifiedBy: 'Pankaj',
    //   dateModified: d.dateFormatted,
    //   dateModifiedValue: d.value,
    //   fileSize: f.value,
    //   fileSizeRaw: f.rawSize,
    // })
    // items.push({
    //   key: 'key2',
    //   name: 'Ipsum',
    //   value: 'file',
    //   iconName: _randomFileIcon().url,
    //   fileType: _randomFileIcon().docType,
    //   modifiedBy: 'Devesh',
    //   dateModified: d.dateFormatted,
    //   dateModifiedValue: d.value,
    //   fileSize: f.value,
    //   fileSizeRaw: f.rawSize,
    // })
    for (let i = 0; i < 500; i++) {
        const randomDate = _randomDate(new Date(2012, 0, 1), new Date());
        const randomFileSize = _randomFileSize();
        const randomFileType = _randomFileIcon();
        let fileName = _lorem(2);
        fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).concat(`.${randomFileType.docType}`);
        let userName = _lorem(2);
        userName = userName
            .split(' ')
            .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
            .join(' ');
        items.push({
            key: i.toString(),
            name: fileName,
            value: fileName,
            iconName: randomFileType.url,
            fileType: randomFileType.docType,
            modifiedBy: userName,
            dateModified: randomDate.dateFormatted,
            dateModifiedValue: randomDate.value,
            fileSize: randomFileSize.value,
            fileSizeRaw: randomFileSize.rawSize,
        });
    }
    return items;
}
function _randomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return {
        value: date.valueOf(),
        dateFormatted: date.toLocaleDateString(),
    };
}
const FILE_ICONS = [
    { name: 'accdb' },
    { name: 'audio' },
    { name: 'code' },
    { name: 'csv' },
    { name: 'docx' },
    { name: 'dotx' },
    { name: 'mpp' },
    { name: 'mpt' },
    { name: 'model' },
    { name: 'one' },
    { name: 'onetoc' },
    { name: 'potx' },
    { name: 'ppsx' },
    { name: 'pdf' },
    { name: 'photo' },
    { name: 'pptx' },
    { name: 'presentation' },
    { name: 'potx' },
    { name: 'pub' },
    { name: 'rtf' },
    { name: 'spreadsheet' },
    { name: 'txt' },
    { name: 'vector' },
    { name: 'vsdx' },
    { name: 'vssx' },
    { name: 'vstx' },
    { name: 'xlsx' },
    { name: 'xltx' },
    { name: 'xsn' },
];
function _randomFileIcon() {
    const docType = FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)].name;
    return {
        docType,
        url: `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${docType}.svg`,
    };
}
function _randomFileSize() {
    const fileSize = Math.floor(Math.random() * 100) + 30;
    return {
        value: `${fileSize} KB`,
        rawSize: fileSize,
    };
}
const LOREM_IPSUM = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
    'labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
    'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
    'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt ').split(' ');
let loremIndex = 0;
function _lorem(wordCount) {
    const startIndex = loremIndex + wordCount > LOREM_IPSUM.length ? 0 : loremIndex;
    loremIndex = startIndex + wordCount;
    return LOREM_IPSUM.slice(startIndex, loremIndex).join(' ');
}
const CSVRender = ({ csv }) => {
    const [items, setItems] = React.useState([]);
    const [columns, setColumns] = React.useState();
    React.useEffect(() => {
        const subscription = csv.subscribe(data => {
            const cols = [];
            for (const column of data[0] || []) {
                cols.push({
                    key: column,
                    name: column,
                    fieldName: column,
                    minWidth: 210,
                    maxWidth: 350,
                    isRowHeader: true,
                    isResizable: true,
                    isSorted: false,
                    isSortedDescending: false,
                    sortAscendingAriaLabel: 'Sorted A to Z',
                    sortDescendingAriaLabel: 'Sorted Z to A',
                    data: 'string',
                    isPadded: true,
                });
            }
            setColumns(cols);
            const header = data[0] || [];
            const items = [];
            for (let i = 1; i < data.length; i++) {
                let row = data[i];
                let obj = header.reduce((prev, curr, j) => {
                    prev[curr] = row[j];
                    return prev;
                }, {});
                items.push(obj);
            }
            setItems(items);
        });
        return subscription.unsubscribe;
    }, []);
    return (React.createElement("div", null,
        React.createElement(DetailsList_1.DetailsList, { items: items, columns: columns, selectionMode: DetailsList_1.SelectionMode.none, getKey: (item) => item.key, setKey: "none", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, isHeaderVisible: true })));
};
exports.CSVRender = CSVRender;
//# sourceMappingURL=index.js.map