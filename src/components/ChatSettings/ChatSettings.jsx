import React, {useState, useRef, useEffect} from 'react';
import {useChat} from "../../context/context";
import {deleteChat, removePerson} from "react-chat-engine";
import {UserPlus, X} from "phosphor-react";
import cn from 'classnames';

import style from "./ChatSettings.module.css";
import {CSSTransition} from "react-transition-group";
import randomColor from "randomcolor";

const ChatSettings = (props) => {
    const {
        chatConfig,
        selectedChat,
    } = useChat();
    const [openModal, setOpenModal] = useState(false);
    const inputAddMembers = useRef(null);

    /*useEffect( () => {
        openModal && inputAddMembers.current.focus();
    },openModal[openModal]);*/
    return (
        <>
            {!!selectedChat &&
                <div className={cn(style.wrapper,{[style.transitionActive]: props.settingsIsOpen})}>
                    <div className={cn(style.header)}>
                        <div className={cn(style.closeButton, {[style.open]: openModal}, style.show)}
                             onClick={() => openModal ? setOpenModal(false) : props.setOpenSettings(false)}>
                            <div className={style.closeButton__icon}></div>
                        </div>

                        <CSSTransition
                            in={!openModal}
                            timeout={.00}
                            classNames={
                                {
                                    exitActive: style.profileTitle_slideTo_active,
                                    exitDone: style.profileTitle_slideTo_done,
                                    enter: style.profileTitle_slideFrom,
                                    enterActive: style.profileTitle_slideFrom_active,

                                }
                            }
                            unmountOnExit
                        >
                            <div className={cn(style.title, style.profileTitle)}>
                                <h3>Profile</h3>
                            </div>
                        </CSSTransition>

                        <CSSTransition
                            in={openModal}
                            timeout={.00}
                            classNames={
                                {
                                    enterActive: style.membersTitle_enterActive,
                                    enterDone: style.membersTitle_enterDone,
                                }
                            }
                            unmountOnExit
                        >
                            <div className={cn(style.title, style.membersTitle)}>
                                <h3>Add Members</h3>
                            </div>
                        </CSSTransition>
                        {/*<section className="tools">
                            <button type="button" className="Button smaller translucent round" title="Edit">
                                <i className="icon-edit"> </i>
                            </button>
                        </section>*/}
                        {/*<button onClick={()=>deleteChat(chatConfig,selectedChat.chatID)}>delete</button>*/}

                    </div>
                    <div className={cn(style.content)}>
                        <CSSTransition
                            in={!openModal}
                            timeout={300}
                            classNames={
                                {
                                    enter: style.profile_zoom,
                                    enterActive: style.profile_zoomActive,
                                    exitActive: style.profile_unZoomActive,
                                }
                            }
                            unmountOnExit
                        >
                            <div className={cn(style.contentWrapper)}>
                                <div className={cn(style.profile, style.scrollable)}>
                                    <div className={style.profilePhoto} style={{
                                        backgroundColor: `${randomColor({
                                            hue: 'orange, yellow, green, blue',
                                            luminosity: 'light',
                                            seed: selectedChat.chatData.title.charCodeAt(0)
                                        })}`
                                    }}>
                                        {selectedChat.chatData.title.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>{selectedChat.chatData.people.length}members</div>
                                    <div>
                                        {selectedChat.chatData.people.map((item, id) => (
                                            <div
                                                key={id}>{item.person.first_name}{chatConfig.userName !== item.person.username &&
                                            <button
                                                onClick={() => removePerson(chatConfig, selectedChat.chatID, item.person.username)}>__delete</button>}</div>
                                        ))}
                                    </div>
                                </div>
                                <button className={style.addUsersIcon} onClick={() => setOpenModal(!openModal)}
                                        title="Add users">
                                    <UserPlus size={28}/>
                                </button>
                            </div>
                        </CSSTransition>

                        <CSSTransition
                            in={openModal}
                            timeout={300}
                            classNames={
                                {
                                    enter: style.addMembers_zoom,
                                    enterActive: style.addMembers_zoomActive,
                                    exitActive: style.addMembers_unZoomActive,
                                }
                            }
                            unmountOnExit
                        >
                            <div className={style.addMembers}>
                                <input type="text"
                                       className={style.modal_search_input}
                                       placeholder={'Search'}
                                       ref={inputAddMembers}
                                />
                            </div>
                        </CSSTransition>

                    </div>


                    {/* <PopupInvite openModal={openModal} setOpenModal={setOpenModal}/>*/}
                </div>
            }
        </>
    );
};

export default ChatSettings;
