import { useState } from 'react'

const COLORS = {
  key: '#9cdcfe',
  string: '#ce9178',
  number: '#b5cea8',
  boolean: '#569cd6',
  bracket: '#d4d4d4'
}

function valueColor(value) {
  if (value === null) return COLORS.boolean
  switch (typeof value) {
    case 'string':
      return COLORS.string
    case 'number':
      return COLORS.number
    case 'boolean':
      return COLORS.boolean
    default:
      return COLORS.string
  }
}

function formatPrimitive(value) {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

function JsonNode({ name, value, isLast }) {
  const [collapsed, setCollapsed] = useState(false)
  const isExpandable = value !== null && typeof value === 'object'

  const comma = isLast ? '' : ','

  if (!isExpandable) {
    return (
      <div className="json-line">
        {name !== undefined && <span style={{ color: COLORS.key }}>"{name}": </span>}
        <span style={{ color: valueColor(value) }}>{formatPrimitive(value)}</span>
        {comma}
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries = isArray ? value.map((v, i) => [i, v]) : Object.entries(value)
  const openBracket = isArray ? '[' : '{'
  const closeBracket = isArray ? ']' : '}'
  const isEmpty = entries.length === 0

  return (
    <div className="json-line">
      <span
        className="json-toggle"
        onClick={() => !isEmpty && setCollapsed((c) => !c)}
        style={{ cursor: isEmpty ? 'default' : 'pointer' }}
      >
        {!isEmpty && <span className="json-caret">{collapsed ? '▶' : '▼'}</span>}
        {name !== undefined && <span style={{ color: COLORS.key }}>"{name}": </span>}
        <span style={{ color: COLORS.bracket }}>{openBracket}</span>
        {collapsed && !isEmpty && (
          <span className="json-collapsed-summary"> … {entries.length} {isArray ? 'items' : 'keys'} </span>
        )}
        {(collapsed || isEmpty) && (
          <span style={{ color: COLORS.bracket }}>
            {closeBracket}
            {comma}
          </span>
        )}
      </span>

      {!collapsed && !isEmpty && (
        <div className="json-children">
          {entries.map(([key, val], i) => (
            <JsonNode key={key} name={key} value={val} isLast={i === entries.length - 1} />
          ))}
        </div>
      )}
      {!collapsed && !isEmpty && (
        <div style={{ color: COLORS.bracket }}>
          {closeBracket}
          {comma}
        </div>
      )}
    </div>
  )
}

export default JsonNode
