export const registerMobile = token => (dispatch, getState) => {
  const userId = getState().session.user.id;

  dispatch({
    type: 'REGISTER_MOBILE',
    socket: {
      type: 'EMIT',
      event: 'register_mobile',
      payload: {
        userId,
        token
      }
    }
  })
};