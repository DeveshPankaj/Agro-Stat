// import * as React from 'react';
// export { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
// import { IButtonProps } from '@fluentui/react/lib/Button';


// const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

// export interface ICommandEvent {
//   type: 'SELECT_FILE' | 'RUN' | 'OPEN_FILE' | 'OPEN_FORM' | 'TILE_VIEW' | 'SHOW_INFO' | 'OPEN_SETTINGS'
//   payload?: unknown
//   event?: unknown
// }

// export const CommandBarBasicExample: React.FunctionComponent<{dispatch: (event: ICommandEvent) => void}> = ({dispatch}) => {

// const _items: ICommandBarItemProps[] = [
//   {
//     key: 'uploadfile',
//     text: 'File',
//     iconProps: { iconName: 'Add' },
//     preferMenuTargetAsEventTarget: true,
//     onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
//       // ev?.persist();
//       dispatch({type: 'SELECT_FILE', event: ev})
//     },
//   },
  
//   {
//     key: 'settings',
//     text: 'Analysis',
//     iconProps: { iconName: 'DatabaseSync' },
//     // onClick: (ev) => {
//     //   dispatch({type: 'OPEN_SETTINGS', event: ev})
//     // },
//     subMenuProps: {
//       items: [
//         {
//           key: 'anova',
//           text: 'Anova',
//           iconProps: { iconName: 'StackColumnChart' },
//           onClick: (ev) => {
//             dispatch({type: 'OPEN_SETTINGS', event: ev, payload: {key: 'Anova'}})
//           },
//         },
//         {
//           key: 'one-factor-analysis',
//           text: 'One Factor Analysis',
//           iconProps: { iconName: 'Financial' },
//           onClick: (ev) => {
//             dispatch({type: 'OPEN_SETTINGS', event: ev, payload: {key: '1 Factor Analysis'}})
//           },
//         },
//         {
//           key: 'path-analysis',
//           text: 'Path Analysis',
//           iconProps: { iconName: 'GitGraph' },
//           onClick: (ev) => {
//             dispatch({type: 'OPEN_SETTINGS', event: ev, payload: {key: 'Path Analysis'}})
//           },
//         },
//       ],
//     },
//   },
//   {
//     key: 'run',
//     text: 'Run',
//     iconProps: { iconName: 'Play' },
//     onClick: (ev) => dispatch({type: 'RUN', event: ev}),
//   },
// ];

// const _overflowItems: ICommandBarItemProps[] = [
//   { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
//   { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
//   { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
// ];

// const _farItems: ICommandBarItemProps[] = [
//   {
//     key: 'tile',
//     text: 'Grid view',
//     // This needs an ariaLabel since it's icon-only
//     ariaLabel: 'Grid view',
//     iconOnly: true,
//     iconProps: { iconName: 'Tiles' },
//     onClick: (ev) => dispatch({type: 'TILE_VIEW', event: ev}),
//   },
//   {
//     key: 'info',
//     text: 'Info',
//     // This needs an ariaLabel since it's icon-only
//     ariaLabel: 'Info',
//     iconOnly: true,
//     iconProps: { iconName: 'Info' },
//     onClick: (ev) => dispatch({type: 'SHOW_INFO', event: ev}),
//   },
// ];


//   return (
//     <>
//       <CommandBar
//         className='ms-depth-4'
//         items={_items}
//         overflowItems={_overflowItems}
//         overflowButtonProps={overflowProps}
//         farItems={_farItems}
//         ariaLabel="Inbox actions"
//         primaryGroupAriaLabel="Email actions"
//         farItemsGroupAriaLabel="More actions"
//       />
//     </>
//   );
// };


