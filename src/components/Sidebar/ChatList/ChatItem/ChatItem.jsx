import React from 'react';
import cn from "classnames";
import style from "./ChatItem.module.css";
import randomColor from "randomcolor";
import {dateOutput} from "../../../../helpers/dateOutput";
import {useChat} from "../../../../context/context";

const ChatItem = ({item}) => {
    const {selectedChat,getMessages} = useChat();

    return (
        <div
            className={cn(style.container, {[style.container_active]: !!selectedChat && selectedChat.chatID === item.id})}
            key={item.id} onClick={() => {
            getMessages(item)
        }}>
            <div className={style.container__left}>
                <div style={{
                    backgroundColor: `${randomColor({
                        luminosity: 'light',
                        seed: item.title.charCodeAt(0)
                    })}`
                }} className={style.chatItemLogo}>{item.title.substring(0, 1).toUpperCase()}</div>
            </div>
            <div className={style.container__right}>
                <div className={style.chatItemTittle}>
                    <h3 className={style.tittle__text}>{item.title}</h3>
                    <div className={style.tittle_details}>
                        {!!item.last_message.created && dateOutput(item.last_message.created)}
                    </div>
                </div>
                <div className={style.chatItemMessage}>
                    {!!item.last_message.sender &&
                    <div className={style.message__text}>
                        <span>{item.last_message.sender.first_name}</span>: {item.last_message.text.replace(/^<p>+|<\/p>$/g, '')}
                    </div>
                    }
                </div>
            </div>

        </div>
    );
};

export default ChatItem;
