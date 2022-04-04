import React, {useState, useRef, useEffect} from 'react';
import {useChat} from "../../context/context";
import cn from 'classnames';
import Modal from "react-responsive-modal";
import {
    GearSix,
    MagnifyingGlass,
    Pen,
    X
} from "phosphor-react";
import {chatApi} from "../../api/api";
import NewChat from "./NewChat/NewChat";
import ChatList from "./ChatList/ChatList";
import style from "./Sidebar.module.css";
import RoundButton from "../Common/RoundButton/RoundButton"
import EditProfile from "./EditProfile/EditProfile";


const Sidebar = () => {
    const [openModal, setOpenModal] = useState(false);
    const [slideSidebar, setSlideSidebar] = useState(false);
    const [sidebarOnMouse, setSidebarOnMouse] = useState(false);
    const [searchField, setSearchField] = useState("");

    const sidebarHeaderRef = useRef(null);
    const sidebarRef = useRef(null);


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


    return (
        <div className={style.wrapper}>
            <div className={cn(style.main, {[style.main_transitionActive]: slideSidebar})} ref={sidebarRef}>
                <div className={style.main__header} ref={sidebarHeaderRef}>
                    <button className={style.header__btnContainer} onClick={() => setOpenModal(true)}>
                        <GearSix size={25} color="#707579"/>
                        <div className={cn(style.animatedBtnIcon, {[style.animatedBtnIcon_active]: openModal})}></div>
                    </button>
                    <div className={style.header__search}>
                        <input type="text" className={style.searchInput} placeholder="Search..." value={searchField}
                               onChange={(e) => setSearchField(e.target.value)}/>
                        <MagnifyingGlass size={20} weight="bold" className={style.searchIcon}/>
                        <button type="button" className={style.clearSearchBtn} onClick={() => setSearchField("")}>
                            <X size={16} className={style.clearSearchIcon}/>
                        </button>
                    </div>
                </div>
                <Modal open={true}
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
                    <EditProfile/>
                </Modal>

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
