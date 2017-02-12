export default function(messages) {
  const parentOrder = [];
  const parents = {};
  const children = {};

  messages.forEach(m => {
    parentOrder.push(m.id);

    parents[m.id] = m;

    m.messages.forEach(m => {
      children[m.id] = m;
    });

    m.messages = m.messages.map(m => m.id);
  });

  return {
    parentOrder,
    parents,
    children
  };
}