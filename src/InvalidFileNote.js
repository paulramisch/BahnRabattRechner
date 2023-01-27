import React from 'react';

const InvalidFileNote = (props) => {
    return (
      <div class="note">
        <p>The following files could not be parsed:</p>
        <ul>
          {props.files.map((file, index) => <li key={index}>{file}</li>)}
        </ul>
        <button onClick={props.handleCloseInvalidFileNote}>Close</button>
      </div>
    );
  }  

export default InvalidFileNote;