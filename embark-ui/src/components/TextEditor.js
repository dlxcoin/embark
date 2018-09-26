import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';

const supportedLanguages = ['css', 'sol', 'html', 'json'];

class TextEditor extends React.Component {
  language() {
    const extension = this.props.file.name.split('.').pop();
    return supportedLanguages[supportedLanguages.indexOf(extension)] || 'javascript';
  }

  extractRowCol(errorMessage) {
    const errorSplit = errorMessage.split(':');
    if (errorSplit.length >= 3) {
      return {row: parseInt(errorSplit[1], 10), col: parseInt(errorSplit[2], 10)};
    }
    return {row: 0, col: 0};
  }

  componentDidUpdate() {
    const {errors, warnings} = this.props.contractCompile;
    const markers = [].concat(errors).concat(warnings).filter((e) => e).map((e) => {
      const {row, col} = this.extractRowCol(e.formattedMessage);
      return {
        startLineNumber: row,
        startColumn: col,
        endLineNumber: row,
        endColumn: col + 1,
        message: e.formattedMessage,
        severity: e.severity
      };
    });
    this.state.monaco.editor.setModelMarkers(this.state.editor.getModel(), 'test', markers);
  }

  editorDidMount(editor, monaco) {
    this.setState({editor, monaco});
  }

  render() {
    return (
      <MonacoEditor
        width="800"
        height="600"
        language={this.language()}
        theme="vs-dark"
        value={this.props.file.content}
        onChange={this.props.onFileContentChange}
        editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)}
      />
    );
  }
}

TextEditor.propTypes = {
  onFileContentChange: PropTypes.func,
  file: PropTypes.object,
  contractCompile: PropTypes.object
};

export default TextEditor;