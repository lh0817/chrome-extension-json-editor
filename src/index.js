import JSONEditor from 'jsoneditor'

// init options for both editors
const options = {
  modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
  onError: function (err) {
    alert(err.toString())
  },
  onModeChange: function (newMode, oldMode) {
    console.log('Mode switched from', oldMode, 'to', newMode)
  },
}

// create editor 1
const editor1 = new JSONEditor(document.getElementById('editor1'), {
  ...options,
  mode: 'text',
  // onChangeText: function (jsonString) {
  //   editor2.updateText(jsonString)
  // },
})

// create editor 2
const editor2 = new JSONEditor(document.getElementById('editor2'), {
  ...options,
  mode: 'tree',
  // onChangeText: function (jsonString) {
  //   editor1.updateText(jsonString)
  // },
})

const tabBtn = document.querySelector('#new-tab')
const syncBtn = document.querySelector('#sync-active')
const syncLeftBtn = document.querySelector('#sync-left')
const syncRightBtn = document.querySelector('#sync-right')
const loadLeftBtn = document.querySelector('#load-left')
const loadRightBtn = document.querySelector('#load-right')
const saveLeftBtn = document.querySelector('#save-left')
const saveRightBtn = document.querySelector('#save-right')

function init() {
  // set initial data in both editors
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

function handleNewTab(e) {
  e.preventDefault()
  chrome.tabs.create({
    url: 'index.html',
    selected: true,
  })
}

function handleSyncActive(e) {
  e.preventDefault()
  // todo
  console.log('handleSyncActive')
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

function handleLoad(e, editor) {
  e.preventDefault()
  console.log(editor.set('test'))
  // todo
  console.log('handleLoad')
}

function handleSave(e, editor) {
  e.preventDefault()
  console.log(editor.get())
  // todo
  console.log('handleSave')
}

// event listener
tabBtn.addEventListener('click', (e) => handleNewTab(e))
syncBtn.addEventListener('click', (e) => handleSyncActive(e))
syncLeftBtn.addEventListener('click', (e) => handleSync(e, editor2, editor1))
syncRightBtn.addEventListener('click', (e) => handleSync(e, editor1, editor2))
loadLeftBtn.addEventListener('click', (e) => handleLoad(e, editor1))
loadRightBtn.addEventListener('click', (e) => handleLoad(e, editor2))
saveLeftBtn.addEventListener('click', (e) => handleSave(e, editor1))
saveRightBtn.addEventListener('click', (e) => handleSave(e, editor2))

// init extension
init()
