import React from 'react';
import {ChatEngine, getChats} from 'react-chat-engine';
import {useChat} from "../../context/context";
import Sidebar from "../../components/Sidebar/Sidebar";

import style from "./Chat.module.css"

const Chat = () => {
    const {chatConfig, setMyChats,} = useChat();
    return (
        <>
            {!!chatConfig &&
            <div className={style.chatWrapper}>
                <ChatEngine
                    projectID={chatConfig.projectID}
                    userName={chatConfig.userName}
                    userSecret={chatConfig.userSecret}
                    onConnect={() => {
                        getChats(chatConfig, setMyChats)
                    }}
                    renderChatList={() => {
                    }}
                    renderChatFeed={() => {
                    }}
                    renderChatSettings={() => {
                    }}
                />
                <Sidebar/>
            </div>
            }
        </>
    );
};

export default Chat;
