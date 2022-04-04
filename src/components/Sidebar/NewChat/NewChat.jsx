import React, {useState, useEffect} from 'react';
import cn from "classnames";
import {ArrowLeft, ArrowRight, Pen, X} from "phosphor-react";
import {CSSTransition} from "react-transition-group";
import {chatApi} from "../../../api/api";
import RoundButton from "../../Common/RoundButton/RoundButton";
import {addPerson, getChats, newChat} from "react-chat-engine";

import style from "./NewChat.module.css";
import {useChat} from "../../../context/context";
import randomColor from "randomcolor";
import Avatar from "../../Common/Avatar/Avatar";
import Spinner from "../../Common/spinner/Spinner";


const NewChat = (props) => {
    const {
        chatConfig,
        myDetails,
    } = useChat();

    const [channelName, setChannelName] = useState("");
    const [searchPerson, setSearchPerson] = useState("");
    const [personList, setPersonList] = useState(null);
    const [filteredPersonList, setFilteredPersonList] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState([]);

    const [isFetching, setFetching] = useState(false);


    useEffect(() => {
        if (!!searchPerson) {
            let find = new RegExp(`${searchPerson.toUpperCase()}`);
            let found = [];
            for (let i = 0; i < personList.length; i++) {
                let str = personList[i].first_name.toUpperCase() + personList[i].last_name.toUpperCase() + personList[i].username.toUpperCase();
                if (str.search(find) !== -1) {
                    found.push(personList[i])
                }
            }
            !!found.length ? setFilteredPersonList(found) : setFilteredPersonList(null)
        } else {
            setFilteredPersonList(null)
        }
    }, [searchPerson]);

    const fetchPersonList = async () => {
        const response = await chatApi.getUser();
        setPersonList(response.filter(item => myDetails.username !== item.username));
    };

    const createChat = () => {
        setFetching(true);
        newChat(chatConfig, {title: channelName}, async (response) => {
            for (let i = 0; i < selectedPerson.length; i++) {
                await addPerson(chatConfig, response.id, selectedPerson[i].username)
            }
            /*await getChats(chatConfig, setMyChats);
            getMessages(response);*/
            setFetching(false);
            props.setSlideSidebar(false)
        });
    };

    return (
        <CSSTransition
            in={props.slideSidebar}
            timeout={500}
            classNames={
                {
                    enterActive: style.transition__sidebar_active,
                    enterDone: style.transition__sidebar_active,
                }
            }
            unmountOnExit
            onEnter={() => fetchPersonList()}
            onExited={() => {
                setChannelName("");
                setSearchPerson("");
                setFilteredPersonList(null);
                setSelectedPerson([]);
            }}
        >
            <div className={cn(style.newChat)}>
                <div className={style.newChat__header}>
                    <button className={style.buttonReturn} onClick={() => props.setSlideSidebar(false)}
                            title='Return to Chat List'>
                        <ArrowLeft size={24}/>
                    </button>
                    <h3>New Chat</h3>
                </div>
                <div className={style.newChat__main}>
                    <div className={style.channelNameWrapper}>
                        <div className={cn(style.inputGroup, {[style.touched]: channelName})}>
                            <input className={style.channelName} type="text" value={channelName}
                                   onChange={(e) => setChannelName(e.target.value)}/>
                            <label className={style.inputPlaceholder}>
                                Channel name
                            </label>
                        </div>
                    </div>

                    <div className={style.addChatMembers}>
                        <div className={style.pickerSelectedList}>
                            {selectedPerson.map((item, id) =>
                                <div className={style.pickerSelectedItem} key={id} onClick={() => {
                                    setSelectedPerson(selectedPerson.filter(elem => elem.username !== item.username))
                                }}>
                                    <Avatar str={item.username} size={`small`} mix={style.itemAvatar}>
                                        {!!item.avatar
                                            ? <img src={item.avatar} alt="Avatar"/>
                                            : (!!item.first_name || !!item.last_name
                                                    ? item.first_name.substring(0, 1).toUpperCase() + item.last_name.substring(0, 1).toUpperCase()
                                                    : item.username.substring(0, 1).toUpperCase()
                                            )
                                        }

                                    </Avatar>
                                    <div className={style.itemName}>
                                        {
                                            !!item.first_name || !!item.last_name
                                                ? `${item.first_name} ${item.last_name}`
                                                : item.username
                                        }
                                    </div>
                                    <div className={style.itemRemove}><X size={20} color="#fcfcfc" weight="bold"/></div>

                                </div>
                            )}

                        </div>
                        <input type="text" className={style.searchPerson} placeholder='Add people...'
                               onChange={(e) => setSearchPerson(e.target.value)} value={searchPerson}
                        />
                    </div>
                    {!filteredPersonList
                        ? <div className={style.noResults}>Sorry, nothing found.</div>
                        : <div className={cn(style.pickerList)}>
                            {filteredPersonList.map((item, id) =>
                                <div className={style.pickerItem} key={id} onClick={() => {
                                    if (selectedPerson.some(elem => elem.username === item.username)) {
                                        setSelectedPerson(selectedPerson.filter(elem => elem.username !== item.username))
                                    } else {
                                        setSelectedPerson([...selectedPerson, item])
                                    }
                                }}>
                                    <div className={style.checkboxContainer}>
                                        <input className={style.checkbox} type="checkbox"
                                               checked={selectedPerson.some(elem => elem.username === item.username)}
                                               onChange={e => {
                                               }}/>
                                        <label className={style.checkbox__animation}> </label>
                                    </div>
                                    <div className={style.personInformation}>
                                        <Avatar str={item.username} size={`medium`} mix={style.mr10}>
                                            {!!item.avatar
                                                ? <img src={item.avatar} alt="Avatar"/>
                                                : (!!item.first_name || !!item.last_name
                                                        ? item.first_name.substring(0, 1).toUpperCase() + item.last_name.substring(0, 1).toUpperCase()
                                                        : item.username.substring(0, 1).toUpperCase()
                                                )
                                            }
                                        </Avatar>
                                        <div className={style.info}><h3>{
                                            !!item.first_name || !!item.last_name
                                                ? `${item.first_name} ${item.last_name}`
                                                : item.username
                                        }</h3></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                    <RoundButton event={createChat} visibility={!channelName} mix={style.creatChatButton}>
                        <ArrowRight size={28}/>
                    </RoundButton>
                </div>
                {
                    isFetching &&
                    <Spinner speed={1.4} customColor={`#4a95d6`}/>
                }
            </div>
        </CSSTransition>
    );
};

export default NewChat;
