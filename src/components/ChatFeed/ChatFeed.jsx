import React, {useState, useRef, useEffect} from 'react';
import Bubbles from "./Bubbles/Bubbles";
import {useChat} from "../../context/context";
import randomColor from "randomcolor";
import {chatApi} from "../../api/api";
import {nanoid} from 'nanoid'
import {sendMessage} from "react-chat-engine";
import style from "./ChatFeed.module.css"


const ChatFeed = (props) => {
    const {
        selectedChat,
        chatConfig,
        setSelectedChat,
        membersTyping,
    } = useChat();
    const [message, setMessage] = useState('');
    let isTyping = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!!message) {
            setSelectedChat({
                ...selectedChat,
                messages: [...selectedChat.messages, {
                    id: nanoid(5),
                    text: message,
                    sender: {username: chatConfig.userName},
                    status: "waiting"
                }]
            });
            sendMessage(chatConfig, selectedChat.chatID, {'text': message, 'sender_username': chatConfig.userName});
            setMessage('');
        }
    };

    useEffect(() => {
        setMessage('');
    }, [selectedChat]);

    return (
        <div className={style.wrapper}>
            {!!selectedChat &&
            <>
                <div className={style.header} onClick={() => props.setOpenSettings(true)}>
                    <div style={{
                        backgroundColor: `${randomColor({
                            luminosity: 'light',
                            seed: selectedChat.chatData.title.charCodeAt(0)
                        })}`
                    }}
                         className={style.chat_icon}>{selectedChat.chatData.title.substring(0, 1).toUpperCase()}</div>
                    <div>
                        <div>{selectedChat.chatData.title}</div>
                        <div>{selectedChat.chatData.people.length}members</div>
                    </div>
                </div>

                <Bubbles/>

                {membersTyping.map((item, id) => (
                    <div key={id}>
                        {item.username} is typing
                        <div className={style.typing}>
                            <div className={style.typing__dot}></div>
                            <div className={style.typing__dot}></div>
                            <div className={style.typing__dot}></div>
                        </div>
                    </div>
                ))}

                <form
                    onSubmit={e => handleSubmit(e)}
                    className={style.newMessageForm}>
                    <input
                        placeholder="Type your message and hit ENTER"
                        type="text" value={message} onChange={e => setMessage(e.target.value)} onFocus={() => {
                        isTyping.current = setInterval(() => {
                            chatApi.userIsTyping(selectedChat.chatID, chatConfig)
                        }, 2000)
                    }} onBlur={() => {
                        clearInterval(isTyping.current)
                    }}/>
                    <input type="submit" value="Отправить"/>
                </form>
            </>
            }

        </div>
    );
};

export default ChatFeed;
