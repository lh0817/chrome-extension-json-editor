import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.min'
import ace from 'ace-builds/src-min-noconflict/ace' // Load Ace Editor
// Import initial theme and mode so we don't have to wait for 2 extra HTTP requests
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/mode-json'

// Workaround for Chromium CSP
ace.config.set('useWorker', false)

// Init options for both editors
const options = {
  modes: ['code', 'form', 'text', 'tree', 'view', 'preview'],
  onModeChange: function (newMode, oldMode) {
    console.log('Mode switched from', oldMode, 'to', newMode)
  },
  ace: ace,
}

// Create editor 1
const editor1 = new JSONEditor(document.getElementById('editor1'), {
  ...options,
  mode: 'text',
  onChangeText: function (jsonString) {
    chrome.storage.local.get(['syncActive'], (result) => {
      if (result.syncActive === true) {
        editor2.updateText(jsonString)
      }
    })
  },
})

// Create editor 2
const editor2 = new JSONEditor(document.getElementById('editor2'), {
  ...options,
  mode: 'tree',
  onChangeText: function (jsonString) {
    chrome.storage.local.get(['syncActive'], (result) => {
      if (result.syncActive === true) {
        editor1.updateText(jsonString)
      }
    })
  },
})

const tabBtn = document.querySelector('#new-tab')
const syncActiveBtn = document.querySelector('#sync-active')
const syncLeftBtn = document.querySelector('#sync-left')
const syncRightBtn = document.querySelector('#sync-right')
const loadLeftBtn = document.querySelector('#load-left')
const loadRightBtn = document.querySelector('#load-right')
const saveLeftBtn = document.querySelector('#save-left')
const saveRightBtn = document.querySelector('#save-right')

const svgSync = document.querySelectorAll('.svg-sync')

/**
 * Init function for extension
 */
function init() {
  // Init storage vars
  chrome.storage.local.set({'syncActive': true})
  // Init disabled btn
  syncLeftBtn.disabled = true
  syncRightBtn.disabled = true
  // Init data in both editors
  const json = {
    'array': [1, 2, 3],
    'boolean': true,
    'null': null,
    'number': 123,
    'object': {'a': 'b', 'c': 'd'},
    'string': 'Hello World'
  }
  editor1.set(json)
  editor2.set(json)
}

/**
 * @param e
 */
function handleNewTab(e) {
  e.preventDefault()
  chrome.tabs.create({
    url: 'index.html',
    selected: true,
  })
}

/**
 * @param e
 */
function handleSyncActive(e) {
  e.preventDefault()
  chrome.storage.local.get(['syncActive'], async (result) => {
    // Set internal var to opposite
    let syncState = !result.syncActive
    await chrome.storage.local.set({'syncActive': syncState})
    // Sync active
    if (syncState === true) {
      svgSync.forEach((svg) => {
        svg.classList.toggle('hidden')
      })
      syncLeftBtn.disabled = true
      syncRightBtn.disabled = true
      return
    }
    // Sync disabled
    svgSync.forEach((svg) => {
      svg.classList.toggle('hidden')
    })
    syncLeftBtn.disabled = false
    syncRightBtn.disabled = false
  })
}

/**
 * @param e
 * @param e1
 * @param e2
 */
function handleSync(e, e1, e2) {
  e.preventDefault()
  e2.set(e1.get())
}

/**
 * @param e
 * @param editor
 * @returns {Promise<void>}
 */
async function handleLoad(e, editor) {
  e.preventDefault()
  let fileHandle
  // Destructure the one-element array.
  [fileHandle] = await window.showOpenFilePicker()
  const file = await fileHandle.getFile()
  const content = await file.text()
  // Set editor content
  editor.setText(content)
}

/**
 * @param e
 * @param editor
 * @returns {Promise<void>}
 */
async function handleSave(e, editor) {
  e.preventDefault()
  const options = {
    types: [
      {
        description: 'JSON Files',
        accept: {
          'text/plain': ['.json'],
        },
      },
    ],
  }
  const fileHandle = await window.showSaveFilePicker(options)
  const file = await fileHandle.createWritable()
  await file.write(editor.getText())
  await file.close()
}

// event listener
tabBtn.addEventListener('click', (e) => handleNewTab(e))
syncActiveBtn.addEventListener('click', (e) => handleSyncActive(e))
syncLeftBtn.addEventListener('click', (e) => handleSync(e, editor2, editor1))
syncRightBtn.addEventListener('click', (e) => handleSync(e, editor1, editor2))
loadLeftBtn.addEventListener('click', (e) => handleLoad(e, editor1))
loadRightBtn.addEventListener('click', (e) => handleLoad(e, editor2))
saveLeftBtn.addEventListener('click', (e) => handleSave(e, editor1))
saveRightBtn.addEventListener('click', (e) => handleSave(e, editor2))

// init extension
init()
