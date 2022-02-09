import React, {useState, useRef, useEffect} from 'react';
import Bubbles from "./Bubbles/Bubbles";
import {useChat} from "../../context/context";
import {chatApi} from "../../api/api";
import {nanoid} from 'nanoid'
import {sendMessage} from "react-chat-engine";
import style from "./ChatFeed.module.css"
import Avatar from "../Avatar/Avatar";
import RoundButton from "../RoundButton/RoundButton";
import {DotsThreeVertical, PaperPlaneTilt, SignOut, TrashSimple} from "phosphor-react";
import cn from "classnames"
import moment from "moment";
import Modal from "react-responsive-modal";
import {fb} from "../../firebase";


const ChatFeed = (props) => {
    const {
        selectedChat,
        chatConfig,
        setSelectedChat,
        membersWhoTyping,
        myDetails,
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

                        <div className={style.header__tool} onClick={() => setOpenModal(true)}>
                            <DotsThreeVertical size={30} color="#707579" weight="bold"/>
                        </div>

                        <Modal open={openModal}
                               onClose={() => setOpenModal(false)}
                               showCloseIcon={false}
                               classNames={
                                   {
                                       root: style.modalRoot,
                                       overlay: style. modalOverlay,
                                       modalContainer: style.modalContainer,
                                       modal: style.modal,
                                       modalAnimationIn: style.modalIn,
                                       modalAnimationOut: style.modalOut,
                                   }}
                               container={headerRef.current}
                        >
                            <div className={style.modalMenuList}>
                                <div className={style.modalMenuItem} onClick={() => fb.auth.signOut()}>
                                    <SignOut size={22} color="#e53935" />
                                    Leave Chat
                                </div>
                                <div className={style.modalMenuItem} onClick={() => fb.auth.signOut()}>
                                    <TrashSimple size={22} color="#e53935" />
                                    Delete and Exit
                                </div>
                            </div>
                        </Modal>
                    </div>

                    <Bubbles/>
                    <div className={style.newMessageForm}>
                        <div className={style.messageInputWrapper}>
                            <div contentEditable="true" ref={newMessageForm}
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
                            <div className={style.svgTail}>
                                <svg width="20" height="25" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path
                                            d="M 0 0 L 9 0 L 9 6 C 10.5 22.5 15.75 22.5 20.25 24.75 C 9 24.75 3 24 0 7.5"
                                            fill="#FFF"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <RoundButton event={handleSubmit} mix={style.sendMessageButton}>
                            <PaperPlaneTilt size={28} weight="fill"/>
                        </RoundButton>
                    </div>
                </>
                }
            </div>
        </div>
    );
};

export default ChatFeed;
