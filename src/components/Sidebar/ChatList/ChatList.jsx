import React from 'react';
import {useChat} from "../../../context/context";
import ChatItem from "./ChatItem/ChatItem";

import style from "./ChatList.module.css";

const ChatList = (props) => {
    const {myChats} = useChat();

    return (
        <div className={style.container}>
            {!!myChats &&
            myChats.map((item,id) =>
                item.title.toUpperCase().search(new RegExp(`${props.searchField.toUpperCase()}`))!== -1 &&
                <ChatItem item={item} key={id}
                />)
            }
        </div>
    );
};

export default ChatList;
