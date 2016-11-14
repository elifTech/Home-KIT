import React from 'react';
import request from 'superagent';
import FileInput from 'react-file-input';
import path from 'path';
import remove from './delete';
import connectThing from 'shared/connect-thing';

class UploadKeys extends React.Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);
    this.removeKey = this.removeKey.bind(this);
    this.state = {
      file: null,
      certError: '',
      keyError: '',
      isOpen: false,
      keyExt: '.key',
      certExt: '.crt'
    }
  }

  removeKey(e, type) {
    e.preventDefault();
    remove(this.props.session.token, this.props.thingName, type, this.props.dispatch);
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
        if (!res.text) {
          return console.log('ERROR parsing response');
        }
        const data = JSON.parse(res.text);
        if (data.type === 'certificate') {
          this.props.dispatch({
            type: 'UPDATE_THINGS',
            data: {
              name: this.props.thingName,
              certPath: data.file,
              keyPath: this.props.things[this.props.thingName].key
            }
          });
        } else if (data.type === 'key') {
          this.props.dispatch({
            type: 'UPDATE_THINGS',
            data: {
              name: this.props.thingName,
              certPath: this.props.things[this.props.thingName].cert,
              keyPath: data.file,
            },
            connect: connectThing,
            dispatch: this.props.dispatch,
            user: this.props.session.token
          });
        }
      });
  }

  render() {
    return (
      <div>
        <h2>Upload your key and certificate for {this.props.thingName}</h2>
        <div className="upload-item">
          <label>AWS certificate (.crt extension)</label>
          {this.props.things[this.props.thingName].cert ?
            <div className="uploaded"> {this.props.things[this.props.thingName].cert} <span className="remove"
                                                                                            onClick={e => this.removeKey(e, 'certificate')}><img
              src={require('./remove.png')}/></span></div> :
            <form>
              <FileInput name="myImage"
                         accept={this.state.certExt}
                         placeholder="Drop here or click to upload"
                         className="drop-area"
                         onChange={(e) => this.inputChange(e, 'certificate')}/>
            </form>
          }
          {this.state.certError}
        </div>
        <div className="upload-item">
          <label>AWS private key (.key extension)</label>
          {this.props.things[this.props.thingName].key ?
            <div className="uploaded"> {this.props.things[this.props.thingName].key} <span className="remove"
                                                                                           onClick={e => this.removeKey(e, 'key')}><img
              src={require('./remove.png')}/></span></div> :
            <form>
              <FileInput name="myImage"
                         accept={this.state.keyExt}
                         placeholder="Drop here or click to upload"
                         className="drop-area"
                         onChange={(e) => this.inputChange(e, 'key')}/>
            </form>
          }
          {this.state.keyError}
        </div>
      </div>
    );
  }
}

// No need to connect()!
export default UploadKeys;
