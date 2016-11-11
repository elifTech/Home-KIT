import React from 'react';
import request from 'superagent';
import FileInput from 'react-file-input';
import path from 'path';

class UploadKeys extends React.Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);

    this.state = {
      file: null,
      certError: '',
      keyError: '',
      isOpen: false,
      keyExt: '.key',
      certExt: '.crt'
    }
  }

  inputChange(e, type) {
    this.setState({
      certError: '',
      keyError: ''
    });
    const file = e.target.files[0];
    if (type === 'certificate' && path.extname(file.name) != this.state.certExt) {
      return this.setState({
        certError: 'Wrong file extension'
      })
    }
    if (type === 'key' && path.extname(file.name) != this.state.keyExt) {
      return this.setState({
        keyError: 'Wrong file extension'
      })
    }
    request.post('/api/keys')
    // .set('Content-Type', 'multipart/form-data')
      .field('user', this.props.session.token)
      .field('type', type)
      .field('thingName', this.props.thingName)
      .attach('file', file)
      .end((error, res) => {
        if (error) {
          console.log(error.message);
        }
        console.log(res);
      });
  }

  render() {
    return (
      <div>
        {this.props.things[this.props.thingName].cert ? this.props.things[this.props.thingName].cert :
          <form>
            <FileInput name="myImage"
                       accept={this.state.certExt}
                       placeholder="AWS certificate (.crt extension)"
                       className="inputClass"
                       onChange={(e) => this.inputChange(e, 'certificate')}/>
          </form>
        }
        {this.state.certError}
        {this.props.things[this.props.thingName].key ? this.props.things[this.props.thingName].key :
        <form>
          <FileInput name="myImage"
                     accept={this.state.keyExt}
                     placeholder="AWS private key (.key extension)"
                     className="inputClass"
                     onChange={(e) => this.inputChange(e, 'key')}/>
        </form>
        }
        {this.state.keyError}
      </div>
    );
  }
}

// No need to connect()!
export default UploadKeys;
