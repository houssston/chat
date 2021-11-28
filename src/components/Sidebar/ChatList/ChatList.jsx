import React from 'react';
import {useChat} from "../../../context/context";
import ChatItem from "./ChatItem/ChatItem";

import style from "./ChatList.module.css";

const ChatList = () => {
    const {myChats} = useChat();

    return (
        <div className={style.container}>
            {!!myChats &&
            myChats.map((item) => <ChatItem item={item}  />)
            }
        </div>
    );
};

export default ChatList;
