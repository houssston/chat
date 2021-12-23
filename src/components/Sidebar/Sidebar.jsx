import React, {useState, useRef, useEffect} from 'react';

import {useChat} from "../../context/context";
import cn from 'classnames';
import {fb} from "../../firebase";
import style from "./Sidebar.module.css";
import Modal from "react-responsive-modal";
import {newChat} from "react-chat-engine";
import {ArrowLeft, Camera, Gear, MagnifyingGlass, Pen, SignOut, X} from "phosphor-react";

import ChatList from "./ChatList/ChatList";
import {CSSTransition} from "react-transition-group";
import {chatApi} from "../../api/api";

const Sidebar = () => {
    const {
        chatConfig,
        myDetails,
        setMyDetails
    } = useChat();
    const [openModal, setOpenModal] = useState(false);
    const [slideSidebar, setSlideSidebar] = useState(false);

    const sidebarHeaderRef = useRef(null);
    const hoverRef = useRef(null);
    const avatarFieldRef = useRef(null);

    const [avatarIsFetching,setAvatarIsFetching] = useState(false);

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

    const uploadAvatar = (e) => {
        if (e.target.files.length) {
            setAvatarIsFetching(true);
            chatApi.updateMyDetails(e.target.files[0], chatConfig).then(
                response => {
                    setMyDetails(response);
                    setAvatarIsFetching(false);
                }
            )
        }
    };

    const createChannel = () => {
        newChat(chatConfig, {title: channelName});
        setSlideSidebar(false);
        setChannelName(null);
    };


    return (
        <div className={cn(style.wrapper, style.transition)} ref={hoverRef}>
            <div className={cn(style.sidebarMain, {[style.transition__sidebar_active]: slideSidebar})}>
                <div className={style.sidebarHeader} ref={sidebarHeaderRef}>

                    <div className={style.avatarContainer}>
                        <div className={style.avatarEdit}>
                            <input className={style.avatarEdit__field} type='file' accept=".png, .jpg, .jpeg" ref={avatarFieldRef} onChange={uploadAvatar} disabled={avatarIsFetching}/>
                            <Camera size={15} weight="fill" className={style.avatarEdit__icon} onClick={() => avatarFieldRef.current.click() }/>
                        </div>
                        <img className={style.avatarPreview} src={myDetails.avatar} alt="Profile photo"/>
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
                        <div className={style.modalMenuList}>
                            <div className={style.modalMenuItem}>
                                <Gear size={22} />
                                Settings
                            </div>
                            <div className={style.modalMenuItem} onClick={() => fb.auth.signOut()}>
                                <SignOut size={22} />
                                Sign out
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
