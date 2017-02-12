import React from 'react'
import langsISO from 'language-list'
import sortBy from 'lodash/sortBy'

const langs = sortBy(langsISO().getData(), l => l.language);

export default props => (
  <select value={props.selected} onChange={props.onChange}>
    <option value="">- Select Language -</option>
    {langs.map(({language, code}) =>
      <option key={code} value={code}>{language}</option>
    )}
  </select>
)