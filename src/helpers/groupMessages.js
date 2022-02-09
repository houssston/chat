import moment from 'moment';
export const groupMessagesByDate = messages => {
    const finalArr = [];
    const currentArr = [];
    let currentDate = '';

    messages.forEach((m) => {
        if (!moment(m.created).isSame(currentDate, 'day')) {
            if (currentDate) {
                finalArr.push({created:moment(currentDate).locale('en').format('MM/DD/YYYY'),message:[...currentArr]});
            }
            currentArr.splice(0, currentArr.length);
            currentArr.push(m);
            currentDate = m.created;
        } else {
            currentArr.push(m);
        }
    });
    finalArr.push({created:moment(currentDate).locale('en').format('MM/DD/YYYY'),message:[...currentArr]});
    //console.log(finalArr);
    return finalArr;
};

export const groupMessagesByAuthor = messages => {
    const finalArr = [];
    const currentArr = [];
    let currentAuthor = '';

    messages.forEach((m) => {
        if (m.sender_username !== currentAuthor) {
            if (currentAuthor) {
                finalArr.push([...currentArr]);
            }
            currentArr.splice(0, currentArr.length);
            currentArr.push(m);
            currentAuthor = m.sender_username;
        } else {
            currentArr.push(m);
        }
    });
    finalArr.push([...currentArr]);
    //console.log(finalArr);
    return finalArr;
};
