import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TooltipHost } from '@fluentui/react';
import { CSV } from '../../services/DataService';
import { Observable } from 'rxjs';

const classNames = mergeStyleSets({
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

export interface IDetailsListDocumentsExampleState {
  columns: IColumn[];
  items: IDocument[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
}

export interface IDocument {
  key: string;
  name: string;
  value: string;
  iconName: string;
  fileType: string;
  modifiedBy: string;
  dateModified: string;
  dateModifiedValue: number;
  fileSize: string;
  fileSizeRaw: number;
}

export class DetailsListDocumentsExample extends React.Component<{}, IDetailsListDocumentsExampleState> {
  private _selection: Selection;
  private _allItems: IDocument[];

  constructor(props: {}) {
    super(props);

    this._allItems = [] || _generateDocuments();

    const columns: IColumn[] = [
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

    CSV.subscribe(data => {
      console.log(data)
      columns.length = 0
      for(const column of data[0]) {
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
        })
      }
      const header = data[0]
      const items = []
      for(let i=1; i < data.length; i++) {
        let row = data[i]
        let obj = header.reduce((prev, curr, j) => {
          prev[curr] = row[j]
          return prev
        }, {} as any)
        items.push(obj)
      }

      this.setState({
        items: items
      })

    })

    this._selection = new Selection({
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

  public render() {
    const { columns, isCompactMode, items, selectionDetails, isModalSelection, announcedMessage } = this.state;

    return (
      <div style={{margin: '1rem'}} className="ms-depth-4">
        <DetailsList
            items={items}
            compact={isCompactMode}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={this._getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onItemInvoked={this._onItemInvoked}
          />
        
      </div>
    );
  }

  public componentDidUpdate(previousProps: any, previousState: IDetailsListDocumentsExampleState) {
    if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
      this._selection.setAllSelected(false);
    }
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IDocument).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          announcedMessage: `${currColumn.name} is sorted ${
            currColumn.isSortedDescending ? 'descending' : 'ascending'
          }`,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

function _generateDocuments() {
  const items: IDocument[] = [];
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
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
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

function _randomDate(start: Date, end: Date): { value: number; dateFormatted: string } {
  const date: Date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return {
    value: date.valueOf(),
    dateFormatted: date.toLocaleDateString(),
  };
}

const FILE_ICONS: { name: string }[] = [
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

function _randomFileIcon(): { docType: string; url: string } {
  const docType: string = FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)].name;
  return {
    docType,
    url: `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${docType}.svg`,
  };
}

function _randomFileSize(): { value: string; rawSize: number } {
  const fileSize: number = Math.floor(Math.random() * 100) + 30;
  return {
    value: `${fileSize} KB`,
    rawSize: fileSize,
  };
}

const LOREM_IPSUM = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
  'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
  'eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt '
).split(' ');
let loremIndex = 0;
function _lorem(wordCount: number): string {
  const startIndex = loremIndex + wordCount > LOREM_IPSUM.length ? 0 : loremIndex;
  loremIndex = startIndex + wordCount;
  return LOREM_IPSUM.slice(startIndex, loremIndex).join(' ');
}




export const CSVRender:React.FC<{csv: Observable<Array<Array<string>>>}> = ({csv}) => {
  const [items, setItems] = React.useState<Array<IDocument>>([])
  const [columns, setColumns] = React.useState<Array<IColumn>>()

  React.useEffect(() => {
    const subscription = csv.subscribe(data => {
      const cols = []
      for(const column of data[0]||[]) {
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
        })
      }
      setColumns(cols)

      const header = data[0] || []
      const items = []
      for(let i=1; i < data.length; i++) {
        let row = data[i]
        let obj = header.reduce((prev, curr, j) => {
          prev[curr] = row[j]
          return prev
        }, {} as any)
        items.push(obj)
      }

      setItems(items)

    })

    return subscription.unsubscribe
  }, [])

  return(
    <div>
      <DetailsList
            items={items}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={(item) => item.key}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
          />
    </div>
  )
}


