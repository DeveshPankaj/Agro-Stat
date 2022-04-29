import { initializeIcons } from '@fluentui/react';
import { createElement } from 'react'
import { render } from 'react-dom'
import { App } from './App'
initializeIcons();

const reactRootElementId = 'app-root'
const panelPortalId = 'app-panel-portal'

if(!document.getElementById(reactRootElementId)) {
    let el = document.createElement('div')
    el.setAttribute('id', reactRootElementId)
    document.body.append(el)
}


if(!document.getElementById(panelPortalId)) {
    let el = document.createElement('div')
    el.setAttribute('id', panelPortalId)
    document.body.append(el)
}

const reactRootElement = document.getElementById(reactRootElementId)

render(createElement(App, {}, []), reactRootElement);

