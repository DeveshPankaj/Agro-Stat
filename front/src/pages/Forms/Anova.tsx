import {
  ActionButton,
  CompoundButton,
  Dropdown,
  DropdownMenuItemType,
  IconButton,
  IDropdownOption,
  PanelType,
  Stack,
  TextField,
} from "@fluentui/react";
import React from "react";
import { BehaviorSubject, Subject } from "rxjs";
import { CSVRender } from "../../components/DataList";
import { PanelContext } from "../../contexts/Panel";
import { ApiContext } from "../../services/ApiService";
import { parseCsvFile, selectFile } from "../../utils/fs";
import CodeMirror from "react-codemirror";
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/r/r'

export const AnovaForm: React.FC<{}> = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [csv, setCsv] = React.useState<Array<Array<string>>>([[]]);
  const [columns, setColumns] = React.useState<Array<string>>([]);

  const selectCSVFile = React.useCallback(() => {
    selectFile().then(async (selectedFile) => {
      if (!selectFile) return;
      setFile(selectedFile);
      let _csv = await parseCsvFile(selectedFile!);
      setCsv(_csv);
    });
  }, [setFile]);

  const panelCtx = React.useContext(PanelContext);
  const openFilePreview = React.useCallback(async () => {
    if (!file) return;
    let CSV = new BehaviorSubject<Array<Array<string>>>(csv);
    panelCtx.open(<CSVRender csv={CSV} />, {
      headerText: "Data preview",
      type: PanelType.medium,
    });
  }, [csv, panelCtx]);

  const openFileColumnRename = () => {
    if (!file) return;
    panelCtx.open(
      <div>
        <ul>
          {csv[0].map((x) => (
            <li>{x}</li>
          ))}
        </ul>
      </div>,
      { headerText: "Rename Column", type: PanelType.medium }
    );
  };

  const options = React.useMemo<Array<IDropdownOption>>(() => {
    const header = csv[0] || [];
    setColumns([]);
    return header.map((x) => ({
      key: x,
      text: x,
    }));
  }, [csv]);

  const apiConfigs = React.useContext(ApiContext);
  const submitRequest = () => {
    console.log(`Creating request`);
    const url = apiConfigs.urls.post.add_request;
    const payload = new FormData();
    payload.append("file-main", file!);
    payload.append("configs", JSON.stringify({ columns }));
    fetch(url, {
      method: "post",
      mode: "no-cors",
      cache: "no-cache",
      body: payload,
    });
  };

  const onselectionchange = React.useCallback(
    (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption) => {
      if (item?.selected) {
        setColumns([...columns, `${item?.key}`]);
      } else {
        setColumns(columns.filter((x) => x !== item?.key));
      }
    },
    [columns]
  );

  return (
    <form>
      <Stack tokens={{ childrenGap: 10 }}>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <ActionButton
            iconProps={{ iconName: "View" }}
            disabled={!file}
            onClick={openFilePreview}
          ></ActionButton>
          <ActionButton
            iconProps={{ iconName: "Edit" }}
            disabled={!file}
            onClick={openFileColumnRename}
          ></ActionButton>
          <ActionButton
            iconProps={{ iconName: file ? "Upload" : "Add" }}
            allowDisabledFocus
            onClick={selectCSVFile}
          >
            Select File {file ? `(${file.name})` : ""}
          </ActionButton>
        </Stack>
        <TextField
          label="Rep"
          type="number"
          defaultValue="1"
          min={1}
          max={50}
          styles={{ wrapper: { width: 300 } }}
        />
        <Dropdown
          placeholder="Select column"
          label="Column"
          options={options}
          selectedKeys={columns}
          onChange={onselectionchange}
          multiSelect
          styles={{ dropdown: { width: 300 } }}
          disabled={!file}
        />

        <CompoundButton
          disabled={!file}
          primary
          secondaryText="Add process in queue."
          onClick={submitRequest}
        >
          Submit
        </CompoundButton>
        <div>
          <CodeMirror
            value="file <- open()"
            options={{
              lineNumbers: true,
              mode: 'r',
              theme: 'darcula'
            }}
          />
        </div>
      </Stack>
    </form>
  );
};
