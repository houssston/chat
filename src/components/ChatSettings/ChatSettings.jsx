import React, {useState, useRef, useEffect} from 'react';
import {useChat} from "../../context/context";
import {deleteChat, removePerson} from "react-chat-engine";
import {PencilSimple, UserPlus, X} from "phosphor-react";
import cn from 'classnames';

import style from "./ChatSettings.module.css";
import {CSSTransition} from "react-transition-group";
import randomColor from "randomcolor";

const ChatSettings = (props) => {
    const {
        chatConfig,
        selectedChat,
    } = useChat();
    const [activeTab, setActiveTab] = useState('profile');
    const inputAddMembers = useRef(null);

    /*useEffect( () => {
        openModal && inputAddMembers.current.focus();
    },openModal[openModal]);*/
    return (
        <>
            {!!selectedChat &&
            <div className={cn(style.wrapper, {[style.transitionActive]: props.settingsIsOpen})}>
                <div className={cn(style.header)}>
                    <div className={cn(style.closeButton, {[style.open]: activeTab !== 'profile'}, style.show)}
                         onClick={() => activeTab !== 'profile' ? setActiveTab('profile') : props.setOpenSettings(false)}>
                        <div className={style.closeButton__icon}></div>
                    </div>

                    {/*profile header
                    <h3 className={cn(style.title,{[style.slideTo]:activeTab !== "profile"})}>Profile</h3>
                    <div className={cn(style.editButton,{[style.slideTo]:activeTab !== "profile"})} onClick={() => setActiveTab('edit')}>
                        <PencilSimple size={23} color="#989BA1" weight="bold"/>
                    </div>

                    Add Members header
                    <div className={cn(style.title,{[style.membersTitle]:activeTab !== "members"})}>
                        <h3>Add Members</h3>
                    </div>*/}

                    <div className={style.slideFadeWrapper}>
                        <CSSTransition
                            in={activeTab === "profile"}
                            timeout={300}
                            classNames={
                                {
                                    exit: style.toLeft,
                                    enter: style.returnFromLeft,
                                    enterActive: style.returnFromLeft_active,
                                }
                            }
                            unmountOnExit
                        >
                            <div className={style.slideFade}>
                                <h3 className={style.title}>Profile</h3>
                                <div className={style.editButton}
                                     onClick={() => setActiveTab('edit')}>
                                    <PencilSimple size={23} color="#989BA1" weight="bold"/>
                                </div>
                            </div>
                        </CSSTransition>
                        <CSSTransition
                            in={activeTab === "edit"}
                            timeout={300}
                            classNames={
                                {
                                    enter: style.fromRight,
                                    enterActive: style.fromRight_active,
                                    exitActive: style.returnToRight_active,
                                }
                            }
                            unmountOnExit
                        >
                            <div className={style.slideFade}>
                                <h3 className={style.title}>Edit</h3>
                            </div>
                        </CSSTransition>
                        <CSSTransition
                            in={activeTab === "addMembers"}
                            timeout={300}
                            classNames={
                                {
                                    enter: style.fromRight,
                                    enterActive: style.fromRight_active,
                                    exitActive: style.returnToRight_active,
                                }
                            }
                            unmountOnExit
                        >
                            <div className={style.slideFade}>
                                <h3 className={style.title}>Add Members</h3>
                            </div>
                        </CSSTransition>
                    </div>

                    {/*<button onClick={() => deleteChat(chatConfig, selectedChat.chatID)}>delete</button>*/}

                </div>
                <div className={cn(style.content)}>
                    <CSSTransition
                        in={activeTab === "profile"}
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
                                            onClick={() => removePerson(chatConfig, selectedChat.chatID, item.person.username)}>__delete</button>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className={style.addUsersIcon} onClick={() => setActiveTab('addMembers')}
                                    title="Add users">
                                <UserPlus size={28}/>
                            </button>
                        </div>
                    </CSSTransition>

                    <CSSTransition
                        in={activeTab === "members"}
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
                            {/*<input type="text"
                                   className={style.modal_search_input}
                                   placeholder={'Search'}
                                   ref={inputAddMembers}
                            />*/}
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
