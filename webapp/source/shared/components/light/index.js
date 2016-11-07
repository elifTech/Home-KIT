import Toggle from 'react-toggle-button';
import changeState from './change-state';
export default React => (props) => <Toggle value={ props.lights[props.color] } onToggle={() => changeState(props.dispatch, props.color, props.lights)}/>;
