import React, {useState, useRef, useEffect} from 'react';

import {useChat} from "../../context/context";
import cn from 'classnames';
import {fb} from "../../firebase";
import style from "./Sidebar.module.css";
import Modal from "react-responsive-modal";
import {newChat} from "react-chat-engine";
import {ArrowLeft, MagnifyingGlass, Pen, X} from "phosphor-react";

import ChatList from "./ChatList/ChatList";
import {CSSTransition} from "react-transition-group";

const Sidebar = () => {
    const {
        chatConfig,
        myChats,
    } = useChat();
    const [openModal, setOpenModal] = useState(false);
    const [slideSidebar, setSlideSidebar] = useState(false);
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
        setSlideSidebar(false);
        setChannelName(null);
    };
    console.log(myChats);

    return (
        <div className={cn(style.wrapper, style.transition)} ref={hoverRef}>
            <div className={cn(style.sidebarMain, {[style.transition__sidebar_active]: slideSidebar})}>
                <div className={style.sidebarHeader} ref={sidebarHeaderRef}>
                    <div className={style.sidebarHeader__profilePhoto}>

                    </div>
                    <button className={style.sidebarHeader__btnContainer} onClick={() => setOpenModal(true)}>
                        <div className={style.btnIcon}></div>
                        <div className={cn(style.animatedBtnIcon, {[style.animatedBtnIcon_active]: openModal})}></div>
                    </button>



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
                <div className={style.searchWrapper}>
                    <input type="text" className={style.searchInput} placeholder="Search"/>
                    <MagnifyingGlass size={22} weight="bold" className={style.searchIcon}/>
                    <button type="button" className={style.buttonClose}>
                        <X size={15} className={style.closeIcon}/>
                    </button>
                </div>

                <ChatList/>

                <div onClick={() => setSlideSidebar(true)} className={style.newChatButton}>
                    <Pen size={28} className={style.newChatIcon}/>
                </div>
            </div>
            <CSSTransition
                in={slideSidebar}
                timeout={500}
                classNames={
                    {
                        enterActive: style.transition__sidebar_active,
                        enterDone: style.transition__sidebar_active,

                    }
                }
                unmountOnExit
            >
                <div className={cn(style.newChat)}>
                    <button onClick={() => setSlideSidebar(false)}>
                        <ArrowLeft size={28}/>
                    </button>
                    <input type="text" onChange={(e) => setChannelName(e.target.value)}/>
                    <button onClick={() => createChannel()}>создать</button>
                </div>

            </CSSTransition>


            {/*newChat(chatConfig,{title:'test2'}, (data) =>{selectChatClick(data.id)}*/}
            {/*<div className={style.new_channel_container}>
                <input type="text" />
                <button>создать</button>
            </div>*/}
        </div>
    );
};

export default Sidebar;
