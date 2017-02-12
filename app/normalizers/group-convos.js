import moment from 'moment'
import sortBy from 'lodash/sortBy'

export function groupedScheduledGroups(groups) {
  const scheduledGroups = groups.reduce((acc, g) => {
    const date = moment(g.start).format('dddd, MMMM Do');
    const dateGroup = acc.find(d => d.date === date);
    if (!dateGroup) {
      acc.push({start: g.start, date, groups: [g]});
    } else {
      dateGroup.groups.push(g);
    }
    return acc;
  }, []);
  return sortBy(scheduledGroups, g => g.start);
}