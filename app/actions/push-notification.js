export const registerMobile = id => {
  return {
    type: 'REGISTER_MOBILE',
    socket: {
      type: 'EMIT',
      event: 'register_mobile',
      payload: id
    }
  }
};