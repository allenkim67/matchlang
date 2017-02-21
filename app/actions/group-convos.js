import axios from '../axios'
import { groupedScheduledGroups } from '../normalizers/group-convos'

export const fetchGroupConvos = ({scheduled, offset=0}) => async dispatch => {
  dispatch({type: 'FETCH_GROUP_CONVOS_START'});
  const type = scheduled ? 'scheduled' : 'regular';
  let convos = (await axios.get(`convos/group/${type}`, {params: {offset}})).data;
  if (scheduled) {
    convos = groupedScheduledGroups(convos);
  }
  const count = (await axios.get(`convos/group/${type}/count`)).data;
  dispatch({type: 'FETCH_GROUP_CONVOS_SUCCESS', convos, scheduled, count});
};

export const createGroupConvo = (convoData, newlyCreated=false) => async dispatch => {
  dispatch({type: 'CREATE_GROUP_CONVO_START'});
  const convo = (await axios.post('convos/group', convoData)).data;
  dispatch({type: 'CREATE_GROUP_CONVO_SUCCESS', convo: {...convo, newlyCreated}});
  dispatch(fetchGroupConvos(convoData.scheduled));
};

export const setChatType = chatType => {
  return {type: 'TOGGLE_CHAT_TYPE', chatType};
};