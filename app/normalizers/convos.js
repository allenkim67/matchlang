export default function(convos) {
  function groupReducer(cs, c) {
    cs.order.push(c.id);
    cs.convos[c.id] = c;
    return cs;
  }

  function privateReducer(cs, c) {
    cs.order.push(c.users[0].id);
    cs.convos[c.users[0].id] = c;
    return cs;
  }

  return {
    group: convos.groupConvos.reduce(groupReducer, {order: [], convos: {}}),
    private: convos.privateConvos.reduce(privateReducer, {order: [], convos: {}})
  };
}