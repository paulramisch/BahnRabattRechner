import React from 'react';

const InvalidFileNote = (props) => {
    return (
      <div class="note">
        <p>Die folgenden Dateien konnten leider nicht verarbeitet werden:</p>
        <ul>
          {props.files.map((file, index) => <li key={index}>{file}</li>)}
        </ul>
        <button onClick={props.handleCloseInvalidFileNote}>Schließen</button>
      </div>
    );
  }  

export default InvalidFileNote;