export default (data, dispatch) => {
  if (!data.data.success) {
    return console.log('Unsuccessful')
  }
  dispatch({type: 'THINGS_AVAILABLE', things: data.data.things});
}
