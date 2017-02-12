import React from 'react'
import autobind from 'autobind-decorator'
import { learningStub, speakingStub } from './lang-stubs'
import LangSelectBasic from './lang-select-basic'
import IoCloseCircled from 'react-icons/io/close-circled'
import css from './lang-select.scss'

@autobind
class LangSelectList extends React.Component {
  render() {
    const addLangButton = <a href='' onClick={this.addLang}>add language</a>;

    return (
      <div className={this.props.css.langSelectList}>
        <div>
          {this.props.langs.map((lang, i) =>
            <LangSelect
              lang={lang}
              langs={this.props.langs}
              updateLangs={this.props.updateLangs}
              key={i}
            />
          )}
        </div>
        {this.props.langs.length < 6 ? addLangButton : null}
      </div>
    );
  }

  @autobind
  addLang(evt) {
    evt.preventDefault();
    this.props.updateLangs([...this.props.langs, this.props.newLang()]);
  }
}

class LangSelect extends React.Component {
  render() {
    const levelSelect = this.props.lang.level !== undefined ?
      <LevelSelect selected={this.props.lang.level} onChange={this.changeHandler.bind(this, 'level')} /> :
      null;

    const removeButton = this.props.langs.length > 1 ?
      <a href='' onClick={this.removeLang}><IoCloseCircled className={css.close}/></a> :
      null;

    return (
      <div>
        <LangSelectBasic selected={this.props.lang.lang} onChange={this.changeHandler.bind(this, 'lang')}/>
        {levelSelect}
        {removeButton}
      </div>
    );
  }

  @autobind
  removeLang(evt) {
    evt.preventDefault();
    const i = this.props.langs.indexOf(this.props.lang);
    this.props.updateLangs([...this.props.langs.slice(0, i), ...this.props.langs.slice(i + 1)]);
  }

  changeHandler(key, evt) {
    const i = this.props.langs.indexOf(this.props.lang);
    this.props.updateLangs([
      ...this.props.langs.slice(0, i),
      {...this.props.langs[i], [key]: evt.target.value},
      ...this.props.langs.slice(i + 1)
    ]);
  }
}

const LevelSelect = props => (
  <select value={props.selected} onChange={props.onChange}>
    <option value="1">Beginner</option>
    <option value="2">Intermediate</option>
    <option value="3">Advanced</option>
  </select>
);

export const SpeakingLangs = props => {
  return <LangSelectList
    langs={props.langs}
    updateLangs={s => props.setState({speakingLangs: s})}
    newLang={speakingStub}
    css={props.css || {}}
  />;
};

export const LearningLangs = props => {
  return <LangSelectList
    langs={props.langs}
    updateLangs={s => props.setState({learningLangs: s})}
    newLang={learningStub}
    css={props.css || {}}
  />;
};