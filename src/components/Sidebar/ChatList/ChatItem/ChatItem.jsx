import React from 'react';
import cn from "classnames";
import style from "./ChatItem.module.css";
import {convertDate} from "../../../../helpers/dateOutput";
import {useChat} from "../../../../context/context";
import Avatar from "../../../Common/Avatar/Avatar";

const ChatItem = ({item}) => {
    const {selectedChat, getMessages} = useChat();

    return (
        <div
            className={cn(style.container, {[style.container_active]: !!selectedChat && selectedChat.chatID === item.id})}
            key={item.id} onClick={() => {
            getMessages(item)
        }}>
            <div className={style.logo}>
                <Avatar str={item.title} size={'large'}>
                    {item.title.substring(0, 1).toUpperCase()}
                </Avatar>
            </div>
            <div className={style.chatInfo}>
                <div className={style.chatInfo__title}>
                    <h3>{item.title}</h3>
                    <div className={style.metadata}>
                        {!!item.last_message.created && convertDate.forSidebar(item.last_message.created)}
                    </div>
                </div>
                {!!item.last_message.sender &&
                <div className={style.chatInfo__lastMessage}>
                    <span>{item.last_message.sender.first_name}</span>: {item.last_message.text.replace(/@space@/g, `${'\u00A0'}`).replace(/@lb@/g, `${'\n'}`)}
                </div>
                }

            </div>


        </div>
    );
};

export default ChatItem;
