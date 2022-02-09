import React from 'react';
import cn from "classnames";
import style from "./ChatItem.module.css";
import {convertDate} from "../../../../helpers/dateOutput";
import {useChat} from "../../../../context/context";
import Avatar from "../../../Avatar/Avatar";

const ChatItem = ({item}) => {
    const {selectedChat,getMessages} = useChat();

    return (
        <div
            className={cn(style.container, {[style.container_active]: !!selectedChat && selectedChat.chatID === item.id})}
            key={item.id} onClick={() => {
            getMessages(item)
        }}>
            <div className={style.left}>
                <Avatar str={item.title} size={`large`}>
                    {item.title.substring(0, 1).toUpperCase()}
                </Avatar>
            </div>
            <div className={style.right}>
                <div className={style.chatItemTittle}>
                    <h3 className={style.tittle__text}>{item.title}</h3>
                    <div className={style.tittle_details}>
                        {!!item.last_message.created && convertDate.forSidebar(item.last_message.created)}
                    </div>
                </div>
                <div className={style.chatItemMessage}>
                    {!!item.last_message.sender &&
                    <div className={style.message__text}>
                        <span>{item.last_message.sender.first_name}</span>: {item.last_message.text.replace(/@space@/g, `${'\u00A0'}`).replace(/@lb@/g, `${'\n'}`)}
                    </div>
                    }
                </div>
            </div>

        </div>
    );
};

export default ChatItem;
