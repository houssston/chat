import React,{useState} from 'react';
import {ChatEngine, deleteChat, getChats} from 'react-chat-engine';
import {useChat} from "../../context/context";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatFeed from "../../components/ChatFeed/ChatFeed";

import style from "./Chat.module.css"
import ChatSettings from "../../components/ChatSettings/ChatSettings";

const Chat = () => {
    const {setMemberIsTyping,
        setMembers,
        createNewChat,
        deleteChat,
        chatConfig,
        setMyChats,
        newMessage,
        } = useChat();
    const [settingsIsOpen, setOpenSettings] = useState(false);
    return (
        <>
            {!!chatConfig &&
            <div className={style.wrapper}>
                <ChatEngine
                    projectID={chatConfig.projectID}
                    userName={chatConfig.userName}
                    userSecret={chatConfig.userSecret}
                    renderChatList={() => {
                    }}
                    renderChatFeed={() => {
                    }}
                    renderChatSettings={() => {
                    }}

                    onConnect={() => {
                        getChats(chatConfig, setMyChats)
                    }}

                    onDeleteChat={(chat) => {
                        console.log("onDeleteChat");
                        deleteChat(chat);
                    }}
                    onNewChat={(chat) => {
                        console.log("onNewChat");
                        createNewChat(chat);
                    }}

                    onAddPerson={(data) => {
                        console.log("onAddPerson");
                        setMembers(data)
                    }}
                    onRemovePerson={(data) => {
                        console.log("onRemovePerson");
                        setMembers(data)
                    }}

                    onTyping={(chatId, username) => {
                        setMemberIsTyping({chatId, username})
                    }}

                    onNewMessage={(chatId, message) => {
                        newMessage({chatId, message})
                    }}
                />
                <Sidebar/>
                <ChatFeed setOpenSettings={setOpenSettings}/>
                 <ChatSettings setOpenSettings={setOpenSettings} settingsIsOpen={settingsIsOpen}/>
            </div>
            }
        </>
    );
};

export default Chat;
