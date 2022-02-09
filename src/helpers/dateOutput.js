import moment from 'moment';

export const convertDate  = {
    forSidebar (date){
        const dateCreated = moment(date);
        const diffYear = moment(date).isSame(moment(), 'year');
        const diffMonth = moment(date).isSame(moment(), 'month');
        const diffWeek = moment(date).isSame(moment(), 'isoWeek');
        const diffHour = moment(date).isSame(moment(), 'day');

        if(diffHour){
            return dateCreated.format('HH:mm');
        }
        else if(diffWeek){
            return dateCreated.format('ddd');
        }
        else if(diffMonth){
            return dateCreated.format('MMM DD');
        }
        else if(diffYear){
            return dateCreated.format('MMM DD YYYY');
        }
        else{
            return dateCreated.format('MMM DD YYYY');
        }
    },
    forChatFeed(date) {
        const dateCreated = moment(date);

        const diffYear = moment(date).isSame(moment(), 'year');
        const diffMonth = moment(date).isSame(moment(), 'month');
        const diffWeek = moment(date).isSame(moment(), 'isoWeek');
        const diffDay = moment(date).diff(moment(),'days') === -1;
        const diffHour = moment(date).isSame(moment(), 'day');

        if(diffHour){
            return "Today";
        }
        else if(diffDay){
            return 'Yesterday';
        }
        else if(diffWeek){
            return dateCreated.format('dddd');
        }
        else if(diffMonth){
            return dateCreated.format('MMMM DD');
        }
        else if(diffYear){
            return dateCreated.format('MMMM DD, YYYY');
        }
        else{
            return dateCreated.format('MMMM DD, YYYY');
        }
    },
    forBubble(date) {
        const dateCreated = moment(date);
        return dateCreated.format('HH:mm');
    }

};
