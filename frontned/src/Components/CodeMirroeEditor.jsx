import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp }   from  '@codemirror/lang-cpp'; // Import the C++ mode

function CodeMirrorEditor({ code, setcode }) {
  const onChange = React.useCallback((value, viewUpdate) => {
    setcode(value);
  }, []);

  return (
    <CodeMirror
      height='100%'
      value={code}
      onChange={onChange}
      extensions={[cpp()]}
    />
  );
}

export default CodeMirrorEditor;
