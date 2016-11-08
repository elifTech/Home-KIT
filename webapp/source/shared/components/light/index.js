import Toggle from 'react-toggle-button';
import changeState from './change-state';
const styles = {
  trackStyle: {
    height: '15px',
    margin: '10px 0'
  },
  thumbStyle: {
    height: '30px',
    width: '30px',
    color: 'white',
    padding: '7px 8px'
  }
};
const style = {
  display: 'inline-block',
  float: 'left',
  margin: '15px'
};
const colors = {
  green: '#009788',
  red: '#E74E40',
  yellow: '#FFC928'
};
const activeColors = {
  green: 'rgba(0, 201, 186, 0.1)',
  red: 'rgba(255, 128, 114, 0.1)',
  yellow: 'rgba(255, 247, 90, 0.1)'
};
export default React => (props) => <div style={style}><div className="label">{props.color}</div><Toggle
  inactiveLabel={''}
  activeLabel={''}
  colors={{
    activeThumb: {
      base: activeColors[props.color]
    },
    inactiveThumb: {
      base: colors[props.color]
    },
    active: {
      base: 'rgb(207,221,245)',
      hover: 'rgb(177, 191, 215)'
    },
    inactive: {
      base: 'rgb(65,66,68)',
      hover: 'rgb(95,96,98)',
    }
  }}
  thumbIcon="✔"
  trackStyle={styles.trackStyle}
  thumbStyle={styles.thumbStyle}
  thumbAnimateRange={[-10, 36]}
  value={ props.lights[props.color] }
  onToggle={() => changeState(props.dispatch, props.color, props.lights)}
/></div>;
