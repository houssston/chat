import moment from 'moment';

export const dateOutput = date => {
    const dateCreated = moment(date).locale('es');
    const diffYear = moment(date).isSame(moment(), 'year');
    const diffMonth = moment(date).isSame(moment(), 'month');
    const diffWeek = moment(date).isSame(moment(), 'isoWeek');
    const diffHour = moment(date).isSame(moment(), 'day');

    if(diffHour){
        return dateCreated.format('hh:mm');
    }
    else if(diffWeek){
        return dateCreated.format('ddd');
    }
    else if(diffMonth){
        return dateCreated.format('MMM DD');
    }
    else if(diffYear){
        return dateCreated.format('MM/DD/YYYY');
    }
    else{
        return dateCreated.format('MM/DD/YYYY');
    }
};
