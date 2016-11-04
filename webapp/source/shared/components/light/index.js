import Toggle from 'react-toggle-button';
import changeState from './change-state';
export default React => (props) => <Toggle value={ props.buttonState } onToggle={() => changeState(props.dispatch, props.color)}/>;
