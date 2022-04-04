import React, {useState, useRef, useEffect} from 'react';
import {useChat} from "../../context/context";
import {deleteChat, removePerson} from "react-chat-engine";
import {Camera, Pen, PencilSimple, UserMinus, UserPlus, X} from "phosphor-react";
import cn from 'classnames';
import style from "./ChatSettings.module.css";
import {CSSTransition} from "react-transition-group";
import randomColor from "randomcolor";
import {getColorForString} from "generate-colors";
import Avatar from "../Common/Avatar/Avatar";
import RoundButton from "../Common/RoundButton/RoundButton";

const ChatSettings = (props) => {
    const {
        chatConfig,
        selectedChat,
        myDetails,
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
                                {selectedChat.chatData.admin.username === myDetails.username &&
                                    <div className={style.editButton}
                                         onClick={() => setActiveTab('edit')}>
                                        <PencilSimple size={23} color="#989BA1" weight="bold"/>
                                    </div>
                                }
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
                </div>
                <div className={style.content}>
                    <CSSTransition
                        in={activeTab === "profile"}
                        timeout={300}
                        classNames={
                            {
                                exit: style.zoomOut,
                                enter: style.returnFromZoomOut,
                                enterActive: style.returnFromZoomOut_active,
                            }
                        }
                        unmountOnExit
                    >
                        <div className={style.zoomFade}>
                            <div className={style.scrollable}>
                                <div className={style.profileTitle} style={{
                                    background: `linear-gradient(rgb(255, 255, 255) -125%, rgb(${getColorForString(selectedChat.chatData.title, {
                                        brightness: () => {
                                            return 45; 
                                        },
                                        saturation: () => {
                                           return 60;
                                        },
                                    }).join(',')})`
                                }}>
                                    <div className={style.profilePhoto} >
                                        {selectedChat.chatData.title.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div className={style.chatInfo}>
                                        <div className={style.chatTitle}>{selectedChat.chatData.title}</div>
                                        <div
                                            className={style.chatStatus}>{selectedChat.chatData.people.length} members
                                        </div>
                                    </div>
                                </div>
                                <div className={style.tabList}>
                                    <div className={cn(style.tabItem, style.tabItem_active)}>Members</div>
                                </div>
                                <div className={style.membersList}>
                                    {selectedChat.chatData.people.map((item, id) => (
                                        <div className={style.membersItem} key={id}>
                                            <Avatar str={item.person.username} size={`medium`} mix={style.memberAvatar}>
                                                {!!item.person.avatar
                                                    ? <img src={item.person.avatar} alt="Profile photo"/>
                                                    : !!item.person.first_name || !!item.person.last_name
                                                        ? item.person.first_name.substring(0, 1).toUpperCase() + item.person.last_name.substring(0, 1).toUpperCase()
                                                        : item.person.username.substring(0, 1).toUpperCase()
                                                }
                                                {chatConfig.userName !== item.person.username && item.person.is_online &&
                                                <div className={style.memberStatus}></div>}
                                            </Avatar>
                                            <div className={style.memberInfo}>
                                                {
                                                    !!item.person.first_name || !!item.person.last_name
                                                        ? item.person.first_name + " " + item.person.last_name
                                                        : item.person.username
                                                }
                                            </div>
                                            {/* {chatConfig.userName !== item.person.username &&
                                                <UserMinus size={20} color="#963c3c" weight="bold" onClick={() => removePerson(chatConfig, selectedChat.chatID, item.person.username)}/>

                                            }*/}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <RoundButton event={() => {
                                setActiveTab('addMembers')
                            }} mix={style.addMembersButton}>
                                <UserPlus size={28} />
                            </RoundButton>
                        </div>
                    </CSSTransition>
                    <CSSTransition
                        in={activeTab === "edit"}
                        timeout={300}
                        classNames={
                            {
                                enter: style.fromZoom,
                                enterActive: style.fromZoom_active,
                                exitActive: style.returnToZoom_active,
                            }
                        }
                        unmountOnExit
                    >
                        <div className={style.zoomFade}>
                            <div className={style.scrollable}>
                                Что такое Lorem Ipsum?
                                Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum
                                является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий
                                безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem
                                Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных
                                изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое
                                время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в
                                более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах
                                которых используется Lorem Ipsum.
                            </div>
                        </div>
                    </CSSTransition>
                    <CSSTransition
                        in={activeTab === "addMembers"}
                        timeout={300}
                        classNames={
                            {
                                enter: style.fromZoom,
                                enterActive: style.fromZoom_active,
                                exitActive: style.returnToZoom_active,
                            }
                        }
                        unmountOnExit
                    >
                        <div className={style.zoomFade}>
                            <div className={style.scrollable}>
                                Почему он используется?
                                Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает
                                сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее
                                стандартное заполнение шаблона, а также реальное распределение букв и пробелов в
                                абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш
                                текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML
                                используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам
                                "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего
                                настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много версий. Некоторые
                                версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).
                            </div>
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
