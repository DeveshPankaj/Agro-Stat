// import React from "react";
// import {
//   Stack,
//   initializeIcons,
//   TextField,
//   IStackProps,
//   IDropdownOption,
//   Dropdown,
//   IDropdownStyles,
// } from "@fluentui/react";
// import { DefaultButton } from "@fluentui/react/lib/Button";
// import "./index.scss";

// import { CommandBarBasicExample } from "./components/Header/CommandBar";
// import { CSVRender } from "./components/DataList";
// import { CSV } from "./services/DataService";
// import { DispatcherEventType } from "./utils";
// import { panel, SharedPanel } from "./services/PanelService";
// import { selectFile } from "./utils/fs";

// initializeIcons();

// export interface IButtonExampleProps {
//   // These are set based on the toggles shown above the examples (not needed in real code)
//   disabled?: boolean;
//   checked?: boolean;
// }

// const columnProps: Partial<IStackProps> = {
//   tokens: { childrenGap: 15 },
//   styles: { root: { width: 300 } },
// };

// const dropdownStyles: Partial<IDropdownStyles> = {
//   dropdown: { width: 300 },
// };

// export const App: React.FC<{}> = ({}) => {
//   const [content, setContent] = React.useState<React.ReactNode>(
//     <CSVRender csv={CSV} />
//   );

//   const [options, setOptions] = React.useState<IDropdownOption[]>([]);

//   React.useEffect(() => {
//     const subscription = CSV.subscribe((csv) => {
//       const header = csv[0] || [];
//       let _options: IDropdownOption[] = header.map((x) => ({
//         key: x.replace(/^\"+|\"+$/g, ""),
//         text: x.replace(/^\"+|\"+$/g, ""),
//       }));

//       setOptions(_options);
//       console.log(_options);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   const [formData, setFormData] = React.useState<{
//     rep: string;
//     gen: string;
//     traits: Array<string>;
//   }>({
//     rep: "3",
//     gen: "",
//     traits: [""],
//   });

//   const commandBarDispatchHandeler = React.useCallback(
//     (event: DispatcherEventType) => {
//       switch (event.type) {
//         case "OPEN_SETTINGS":
//           panel.open({
//             title: (event?.payload as { key: string })?.key || "Config",
//             onSave: (data: any) => {
//               console.log(formData);
//             },
//             content: (
//               <>
//                 {options.length === 0 ? (
//                   <code style={{ color: "red" }}>No file selected!</code>
//                 ) : null}
//                 <Stack {...columnProps}>
//                   {/* <Dropdown
//                     placeholder="column name"
//                     label="Rep"
//                     options={options}
//                     styles={dropdownStyles}
//                     onChange={(event, option) => formData.rep = option?.key}
//                   /> */}

//                   <TextField
//                     label="Rep"
//                     placeholder="Rep count"
//                     defaultValue={formData.rep}
//                     type="number"
//                     onChange={(event, value) =>
//                       setFormData({ ...formData, rep: value || "" })
//                     }
//                   />

//                   <Dropdown
//                     placeholder="column name"
//                     label="Gen"
//                     options={options}
//                     styles={dropdownStyles}
//                     onChange={(event, option) =>
//                       setFormData({ ...formData, gen: option?.text || "" })
//                     }
//                   />

//                   <DefaultButton
//                     label="Add trait"
//                     onClick={() =>
//                       setFormData({
//                         ...formData,
//                         traits: {
//                           ...formData.traits,
//                           [formData.traits.length]: "",
//                         },
//                       })
//                     }
//                   />
//                   {formData.traits.map((x: string, i: number) => (
//                     <Dropdown
//                       key={i}
//                       placeholder="column name"
//                       label="Trait"
//                       options={options}
//                       styles={dropdownStyles}
//                       onChange={(event, option) =>
//                         setFormData({
//                           ...formData,
//                           traits: {
//                             ...formData.traits,
//                             [i]: option?.text || "",
//                           },
//                         })
//                       }
//                     />
//                   ))}
//                 </Stack>
//               </>
//             ),
//             // navContent: <>
//             // hi
//             // </>
//           });
//           break;

//         case "SELECT_FILE":
//           _loadCsv();
//           break;

//         case "RUN":
//           console.log(`Running ...`);
//           break;
//       }
//     },
//     [options, formData]
//   );

//   return (
//     <div className="ms-Fabric" dir="ltr">
//       <div className="ms-Grid">
//         <div
//           className="ms-Grid-row"
//           style={{ position: "sticky", top: "0", zIndex: 100 }}
//         >
//           <CommandBarBasicExample dispatch={commandBarDispatchHandeler} />
//           {/* <ActionButton iconProps={addFriendIcon} allowDisabledFocus onClick={_alertClicked}>
//                       Create account
//                     </ActionButton> */}
//         </div>
//         <div className="ms-Grid-row">
//           {/* <NavBasicExample/> */}
//           {/* <DetailsListDocumentsExample /> */}
//           {content}
//         </div>
//       </div>

//       {/* <Spinner size={SpinnerSize.medium} />  */}
//       <SharedPanel />
//     </div>
//   );
// };

// function _loadCsv(): void {
//   selectFile().then((file) => {
//     if (!file) return;
//     const chunk = file.slice(0, 1024);

//     const csv: Array<Array<string>> = [];

//     let str = "";
//     const reader = new FileReader();
//     reader.addEventListener("load", function (e) {
//       str = (e?.target?.result as string) || "";

//       const lines = str.split("\n");

//       const header = lines[0].split(",").map((x) => x.trim());
//       csv.push(header);

//       for (let i = 1; i < lines.length; i++) {
//         if (!lines[0].length) break;
//         let line = lines[i].split(",").map((x) => x.trim());
//         csv.push(line);
//       }
//       CSV.next(csv);
//     });
//     reader.readAsBinaryString(chunk);
//   });
// }
