import JSONEditor from 'jsoneditor'

function init() {
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
  const editor1 = new JSONEditor(document.getElementById('jsoneditor1'), {
    ...options,
    mode: 'text',
    onChangeText: function (jsonString) {
      editor2.updateText(jsonString)
    },
  })

  // create editor 2
  const editor2 = new JSONEditor(document.getElementById('jsoneditor2'), {
    ...options,
    mode: 'tree',
    onChangeText: function (jsonString) {
      editor1.updateText(jsonString)
    },
  })

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

// init extension
init()
