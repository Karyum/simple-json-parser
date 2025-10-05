import { useState } from 'react'
import { Flex, Button, message, Switch } from 'antd'
import './App.css'

function isJsonStringValid(jsonString) {
  try {
    JSON.parse(jsonString)
    return true
  } catch (e) {
    return false
  }
}

const syntaxHighlight = (json) => {
  json = JSON.stringify(json, null, 2)
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = '#b5cea8' // numbers
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = '#9cdcfe' // keys
        } else {
          color = '#ce9178' // strings
        }
      } else if (/true|false|null/.test(match)) {
        color = '#569cd6' // booleans/null
      }
      return `<span style="color: ${color}">${match}</span>`
    }
  )
}

function App() {
  const [json, setJson] = useState('')
  const [mode, setMode] = useState('parse')

  return (
    <Flex className="main" justify="space-evenly">
      <Button
        className="repo-link"
        type="link"
        onClick={() => window.open('https://github.com/Karyum/simple-json-parser', '__blank')}
      >
        Github Repo
      </Button>

      <Flex className="textarea-container" vertical gap={10}>
        <Flex gap={10} align="center">
          <span>Parse</span>
          <Switch
            onChange={(event) => {
              setMode(event ? 'compress' : 'parse')
            }}
            checked={mode === 'compress'}
          />
          <span>Compress</span>
        </Flex>
        <textarea
          className="textarea"
          onChange={({ target }) => setJson(target.value)}
          value={json}
        />
      </Flex>

      <div className="json-view-container">
        <pre
          className="json-view"
          dangerouslySetInnerHTML={{
            __html:
              mode === 'parse' && isJsonStringValid(json)
                ? syntaxHighlight(JSON.parse(json))
                : mode === 'compress' && isJsonStringValid(json)
                ? JSON.stringify(JSON.parse(json))
                : ''
          }}
        ></pre>
        <Button
          className="copy-button"
          onClick={() => {
            if (isJsonStringValid(json)) {
              if (mode === 'parse') {
                navigator.clipboard.writeText(JSON.stringify(JSON.parse(json), null, 2))
                message.success('JSON Copied')
              }

              if (mode === 'compress') {
                navigator.clipboard.writeText(JSON.stringify(JSON.parse(json)))
                message.success('JSON Copied')
              }
            } else {
              message.error('You need valid JSON')
            }
          }}
        >
          Copy
        </Button>
      </div>
    </Flex>
  )
}

export default App
