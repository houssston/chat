import React, {useState, useRef, useEffect} from 'react';
import {useChat} from "../../context/context";
import cn from 'classnames';
import {fb} from "../../firebase";
import Modal from "react-responsive-modal";
import {Camera, Gear, MagnifyingGlass, Pen, SignOut, X} from "phosphor-react";
import {chatApi} from "../../api/api";
import NewChat from "./NewChat/NewChat";
import ChatList from "./ChatList/ChatList";

import style from "./Sidebar.module.css";
import RoundButton from "../RoundButton/RoundButton";
import {addPerson} from "react-chat-engine";
import Avatar from "../Avatar/Avatar";
import {CSSTransition} from "react-transition-group";

const Sidebar = () => {
    const {
        chatConfig,
        myDetails,
        setMyDetails
    } = useChat();
    const [openModal, setOpenModal] = useState(false);
    const [slideSidebar, setSlideSidebar] = useState(false);
    const [sidebarOnMouse, setSidebarOnMouse] = useState(false);
    const [searchField, setSearchField] = useState("");

    const sidebarHeaderRef = useRef(null);
    const sidebarRef = useRef(null);
    const avatarFieldRef = useRef(null);

    const [avatarIsFetching, setAvatarIsFetching] = useState(false);

    const toggleSidebar = () => setSlideSidebar(!slideSidebar);
    const handleMouseEnter = () => setSidebarOnMouse(true);
    const handleMouseLeave = () => {
        setOpenModal(false);
        setSidebarOnMouse(false)
    };
    useEffect(() => {
        sidebarRef.current.addEventListener('mouseenter', handleMouseEnter);
        sidebarRef.current.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            !!sidebarRef.current && sidebarRef.current.removeEventListener('mouseenter', handleMouseEnter);
            !!sidebarRef.current && sidebarRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
    });
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
    return (
        <div className={cn(style.wrapper, style.transition)}>
            <div className={cn(style.main, {[style.main_transitionActive]: slideSidebar})} ref={sidebarRef}>

                <div className={style.header} ref={sidebarHeaderRef}>
                    <Avatar str={myDetails.username} size={`medium`} mix={style.avatarContainer}>
                        <div className={style.avatarEdit}>
                            <input className={style.avatarEdit__field} type='file' accept=".png, .jpg, .jpeg"
                                   ref={avatarFieldRef} onChange={uploadAvatar} disabled={avatarIsFetching}/>
                            <Camera size={15} weight="fill" className={style.avatarEdit__icon}
                                    onClick={() => avatarFieldRef.current.click()}/>
                        </div>
                        {!!myDetails.avatar
                            ? <img className={style.avatarPreview} src={myDetails.avatar} alt="Profile photo"/>
                            : !!myDetails.first_name || !!myDetails.last_name
                                ? myDetails.first_name.substring(0, 1).toUpperCase() + myDetails.last_name.substring(0, 1).toUpperCase()
                                : myDetails.username.substring(0, 1).toUpperCase()
                        }
                    </Avatar>

                    <button className={style.header__btnContainer} onClick={() => setOpenModal(true)}>
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
                                <Gear size={22}/>
                                Settings
                            </div>
                            <div className={style.modalMenuItem} onClick={() => fb.auth.signOut()}>
                                <SignOut size={22}/>
                                Sign Out
                            </div>
                        </div>
                    </Modal>

                </div>

                <div className={style.searchWrapper}>
                    <input type="text" className={style.searchInput} placeholder="Search" value={searchField}
                           onChange={(e) => setSearchField(e.target.value)}/>
                    <MagnifyingGlass size={22} weight="bold" className={style.searchIcon}/>
                    <button type="button" className={style.clearSearchInput} onClick={() => setSearchField("")}>
                        <X size={15} className={style.clearIcon}/>
                    </button>
                </div>

                <ChatList searchField={searchField}/>

                <RoundButton event={toggleSidebar} visibility={!sidebarOnMouse} mix={style.newChatButton}>
                    <Pen size={28}/>
                </RoundButton>

            </div>

            <NewChat slideSidebar={slideSidebar} setSlideSidebar={setSlideSidebar}/>

        </div>
    );
};

export default Sidebar;
