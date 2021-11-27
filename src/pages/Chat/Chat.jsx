import React from 'react';
import {ChatEngine, getChats} from 'react-chat-engine';
import {useChat} from "../../context/context";

const Chat = () => {
    const {chatConfig,setMyChats,} = useChat();
    console.log(chatConfig);
    return (
        <div>{!!chatConfig &&
        <ChatEngine
            projectID={chatConfig.projectID}
            userName={chatConfig.userName}
            userSecret={chatConfig.userSecret}

            /*onConnect={() => {
                getChats(chatConfig, setMyChats)
            }}*/
            /*renderChatList={() => {
            }}
            renderChatFeed={() => {
            }}
            renderChatSettings={() => {
            }}*/
        />
        }
        </div>
    );
};

export default Chat;
