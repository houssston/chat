import React, {useState, useRef, useEffect} from 'react';
import Bubbles from "./Bubbles/Bubbles";
import {useChat} from "../../context/context";
import {chatApi} from "../../api/api";
import {nanoid} from 'nanoid'
import {deleteChat, leaveChat, removePerson, sendMessage} from "react-chat-engine";
import style from "./ChatFeed.module.css"
import Avatar from "../Common/Avatar/Avatar";
import RoundButton from "../Common/RoundButton/RoundButton";
import {DotsThreeVertical, PaperPlaneTilt, SignOut, TrashSimple} from "phosphor-react";
import cn from "classnames"
import moment from "moment";
import Modal from "react-responsive-modal";



const ChatFeed = (props) => {
    const {
        selectedChat,
        chatConfig,
        setSelectedChat,
        membersWhoTyping,
        myDetails,
        setMyChats,
        myChats
    } = useChat();
    const [message, setMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const isTyping = useRef(null);
    const newMessageForm = useRef(null);
    const headerRef = useRef(null);

    const handleSubmit = () => {
        if (!!message) {
            setSelectedChat({
                ...selectedChat,
                messages: [...selectedChat.messages, {
                    id: nanoid(5),
                    text: message,
                    sender: {username: chatConfig.userName},
                    status: "waiting",
                    created: moment().format(),
                    sender_username: chatConfig.userName
                }]
            });
            sendMessage(chatConfig, selectedChat.chatID, {'text': message, 'sender_username': chatConfig.userName});
            setMessage('');
            newMessageForm.current.textContent = "";
        }
    };

    useEffect(() => {
        setMessage('');
    }, [selectedChat]);


    const handlerFocus = () => {
        isTyping.current = setInterval(() => {
            chatApi.userIsTyping(selectedChat.chatID, chatConfig)
        }, 2000)
    };
    const handlerBlur = () => {
        clearInterval(isTyping.current);
    };
    useEffect(() => {
        !!newMessageForm.current && newMessageForm.current.addEventListener('focus', handlerFocus);
        !!newMessageForm.current && newMessageForm.current.addEventListener('blur', handlerBlur);
        return () => {
            !!newMessageForm.current && newMessageForm.current.removeEventListener('focus', handlerFocus);
            !!newMessageForm.current && newMessageForm.current.removeEventListener('blur', handlerBlur);
        }
    });

    const deleteChat = () => {
        //setMyChats()
        setSelectedChat(null);
    };

    return (
        <div className={cn(style.wrapper)}>
            <div className={cn(style.inner, {[style.inner_transition]: props.settingsIsOpen})}>


                {!!selectedChat &&
                <>
                    <div className={style.header} ref={headerRef}>
                        <div className={style.chatInfo} onClick={() => props.setOpenSettings(true)}>
                            <Avatar str={selectedChat.chatData.title} size={`medium`} mix={style.chatIcon}>
                                {selectedChat.chatData.title.substring(0, 1).toUpperCase()}
                            </Avatar>
                            <div className={style.info}>
                                <h3 className={style.title}>{selectedChat.chatData.title}</h3>
                                <div className={style.status}>
                                    {!!membersWhoTyping.length
                                        ?
                                        <div className={style.whoTyping}>
                                            <div className={style.whoTyping__list}>
                                                {membersWhoTyping.map((item, id) => (
                                                    <div className={style.whoTyping__item} key={id}>
                                                        {!!item.first_name || !!item.last_name
                                                            ? item.first_name + item.last_name
                                                            : item.username}
                                                    </div>
                                                ))}
                                                is typing
                                            </div>
                                            <div className={style.typing}>
                                                <div className={style.typing__dot}></div>
                                                <div className={style.typing__dot}></div>
                                                <div className={style.typing__dot}></div>
                                            </div>
                                        </div>
                                        : <>
                                            {selectedChat.chatData.people.length} members{
                                            selectedChat.chatData.people.reduce(function (value, currentItem) {
                                                if (currentItem.person.is_online === true && currentItem.person.username !== myDetails.username) {
                                                    value++;
                                                }
                                                return value;

                                            }, 0) > 0 && <>, {selectedChat.chatData.people.reduce(function (value, currentItem) {
                                                if (currentItem.person.is_online === true && currentItem.person.username !== myDetails.username) {
                                                    value++;
                                                }
                                                return value;

                                            }, 0)} online</>
                                        }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={style.header__tool} onClick={() => {
                            setOpenModal(true)
                        }}>
                            <DotsThreeVertical size={30} color="#989BA1" weight="bold"/>
                        </div>

                        <Modal open={openModal}
                               onClose={() => setOpenModal(false)}
                               showCloseIcon={false}
                               classNames={
                                   {
                                       root: style.modalRoot,
                                       modalContainer: style.modalContainer,
                                       modal: style.modal,
                                       modalAnimationIn: style.modalIn,
                                       modalAnimationOut: style.modalOut,
                                   }}
                               styles={{
                                   modal: {left: headerRef.current != null ? headerRef.current.getBoundingClientRect().right - 210 - 15 : 0}
                               }}
                        >
                            <div className={style.modalMenuList}>
                                {
                                    selectedChat.chatData.admin.username === myDetails.username
                                        ? <div className={style.modalMenuItem} onClick={() => {
                                            deleteChat(chatConfig, selectedChat.chatID);
                                            setSelectedChat(null);
                                        }}>
                                            <TrashSimple size={22} color="#e53935"/>
                                            Delete and Exit
                                        </div>
                                        : <div className={style.modalMenuItem} onClick={() => {
                                            leaveChat(chatConfig, selectedChat.chatID);
                                            setSelectedChat(null);
                                        }}>
                                            <SignOut size={22} color="#e53935"/>
                                            Leave Chat
                                        </div>
                                }
                            </div>
                        </Modal>
                    </div>

                    <Bubbles/>

                    <div className={style.newMessageWrapper}>
                        <div className={style.newMessageForm}>
                            <div className={style.messageFieldWrapper}>
                                <div contentEditable="true" ref={newMessageForm}
                                     placeholder="Type a new message..."
                                     className={cn(style.messageInput, style.customScroll)}
                                     onKeyDown={event => {
                                         if (event.keyCode === 13 && !event.shiftKey) {
                                             event.preventDefault();
                                             handleSubmit();
                                         }
                                     }}
                                     onPaste={event => {
                                         let str = event.clipboardData.getData('text').replace(/\r?\n/g, " ");
                                         event.preventDefault();
                                         document.execCommand('insertText', false, str);
                                     }}
                                     onInput={event => {
                                         setMessage(event.target.innerHTML
                                             .replace(/^[\s" "]+|[\s" "]+$|^[\s<br>]+|[\s<br>]+$/g, '')
                                             .replace(/ /g, "@space@").replace(/<br>+|[\n]/g, "@lb@"))
                                     }}
                                />
                            </div>
                            <RoundButton event={handleSubmit} mix={style.sendMessageButton}>
                                <PaperPlaneTilt size={28} weight="fill"/>
                            </RoundButton>
                        </div>
                    </div>
                </>
                }
            </div>
        </div>
    );
};

export default ChatFeed;
