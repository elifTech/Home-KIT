import React from 'react';
import request from 'superagent';
import FileInput from 'react-file-input';

class UploadKeys extends React.Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);

    this.state = {
      file: null,
      fileError: '',
      isOpen: false
    }
  }

  inputChange(e) {
    console.log(e.target.files[0]);
    request.post('/api/keys')
     // .set('Content-Type', 'multipart/form-data')
      .attach('file', e.target.files[0])
      .end((error, res) => {
      if (error) {
        console.log(error);
      }
      console.log(res);
    });
  }

  render() {
    return (
      <form>
        <FileInput name="myImage"
                   accept=".crt"
                   placeholder="My Image"
                   className="inputClass"
                   onChange={this.inputChange} />
      </form>
    );
  }
}

// No need to connect()!
export default UploadKeys;
