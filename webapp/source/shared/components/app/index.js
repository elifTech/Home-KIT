import { connect } from 'react-redux';
import createTitle from 'shared/components/title';
import createButton from 'shared/components/light';

const createApp = React => ({ dispatch, lights }) => {
  const Title = createTitle(React);
  const LightButton = createButton(React);
  return (
    <div>
      <Title title='Lights' />
      <LightButton color="yellow" buttonState={ lights.yellow } dispatch={ dispatch } />
      <LightButton color="green" buttonState={ lights.green } dispatch={ dispatch } />
      <LightButton color="red" buttonState={ lights.red } dispatch={ dispatch } />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { lights } = state;
  return { lights };
};

// Connect props to component
export default React => {
  const App = createApp(React);
  return connect(mapStateToProps)(App);
};
