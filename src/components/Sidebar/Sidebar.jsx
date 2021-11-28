import React, {useState, useRef, useEffect} from 'react';

import {useChat} from "../../context/context";
import randomColor from "randomcolor";
import cn from 'classnames';
import {fb} from "../../firebase";
import style from "./Sidebar.module.css";
import Modal from "react-responsive-modal";
import {newChat} from "react-chat-engine";
import {ArrowLeft, Pen} from "phosphor-react";

import ChatList from "./ChatList/ChatList";

const Sidebar = () => {
    const {
        chatConfig,
        myChats,
        getMessages,
        selectedChat,
    } = useChat();
    const [openModal, setOpenModal] = useState(false);
    const [moveSidebar, setMoveSidebar] = useState(false);
    const sidebarHeaderRef = useRef(null);
    const hoverRef = useRef(null);
    const [channelName, setChannelName] = useState(null);

    const handleMouseEnter = () => setOpenModal(false);

    useEffect(() => {

        if (openModal) {
            hoverRef.current.addEventListener('mouseleave', handleMouseEnter);
            return () => {
                !!hoverRef.current && hoverRef.current.removeEventListener('mouseleave', handleMouseEnter);
            }
        }

    }, [openModal]);

    const createChannel = () => {
        newChat(chatConfig, {title: channelName});
        setMoveSidebar(false);
        setChannelName(null);
    };


    return (
        <div className={style.wrapper} ref={hoverRef}>
            <div className={cn(style.main, {[style.main_slideLeft]: moveSidebar})}>
                <div className={style.mainHeader} ref={sidebarHeaderRef}>
                    <button className={style.mainHeader__btnContainer} onClick={() => setOpenModal(true)}>
                        <div className={style.btnIcon}></div>
                        <div className={cn(style.animatedBtnIcon, {[style.animatedBtnIcon_active]: openModal})}></div>
                    </button>

                    <input type="text"/>

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
                           container={sidebarHeaderRef.current}
                    >
                        <div>
                            <div>
                                <button
                                    onClick={() => fb.auth.signOut()}
                                    className="sign-out"
                                    name="sign out"

                                >sign out
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>

                <ChatList/>

                <div onClick={() => setMoveSidebar(true)} className={style.sidebar_toggle}>
                    <Pen size={28}/>
                </div>
            </div>
            <div className={cn(style.new_channel_container, {[style.move_new_channel]: moveSidebar})}>
                <button onClick={() => setMoveSidebar(false)}>
                    <ArrowLeft size={28}/>
                </button>
                <input type="text" onChange={(e) => setChannelName(e.target.value)}/>
                <button onClick={() => createChannel()}>создать</button>
            </div>

            {/*newChat(chatConfig,{title:'test2'}, (data) =>{selectChatClick(data.id)}*/}
            {/*<div className={style.new_channel_container}>
                <input type="text" />
                <button>создать</button>
            </div>*/}
        </div>
    );
};

export default Sidebar;
