import React, {useEffect, useState, useContext} from 'react';
import {fb} from "../firebase";
import {doc, onSnapshot} from "firebase/firestore";
import {chatApi} from "../api/api";
import {getChats} from "react-chat-engine";
import moment from 'moment';


export const ChatContext = React.createContext();

export const ChatProvider = ({children, authUser}) => {
    const [chatConfig, setChatConfig] = useState(null);
    const [myChats, setMyChats] = useState(null);
    const [myDetails, setMyDetails] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [typing, setTyping] = useState([]);
    const [membersWhoTyping, setMembersWhoTyping] = useState([]);
    const [isFetching, setFetching] = useState(true);

    const getMessages = async (chatData, page = 1) => {
        setFetching(true);
        let data = await chatApi.getLatestMessages(chatData.id, page * 15, chatConfig);
        setSelectedChat({
            chatData,
            chatID: chatData.id,
            messages: data,
            currentPage: page,
            hasMoreMessage: data.length === page * 15 ? true : false
        });
        setFetching(false);
    };

    const createNewChat = (chatData) => {
        setMyChats([...myChats, chatData]);
        if (chatData.admin.username === myDetails.username) {
            getMessages(chatData);
        }
    };

    const deleteChat = (chat) => {
        if (!!selectedChat) {
            if (selectedChat.chatID === chat.id) {
                getChats(chatConfig, (chats) => {
                    setMyChats(chats);
                    setSelectedChat(null);
                })
            } else {
                getChats(chatConfig, setMyChats)
            }
        } else {
            getChats(chatConfig, setMyChats)
        }
    };

    const setMembers = (data) => {
        !!selectedChat && data.id === selectedChat.chatID &&
        setSelectedChat({
            ...selectedChat, chatData: data
        })
    };

    const setMemberIsTyping = (data) => {
        if (!!selectedChat && data.chatId === selectedChat.chatID && data.username !== myDetails.username) {
            typing.some(e => e.username === data.username)
                ? setTyping(typing.map(e => {
                    if (e.username === data.username) {
                        return {...e, date: moment().format()}
                    }
                    return e;
                }))
                : setTyping([...typing, {
                    ...selectedChat.chatData.people.find(e => e.person.username === data.username).person,
                    date: moment().format()
                }])
        }
    };

    const logout = () => {
        setChatConfig(null);
        setMyChats(null);
        setMyDetails(null);
        setSelectedChat(null);
    };

    useEffect(() => {
        setMembersWhoTyping(typing.filter(member => moment().diff(moment(member.date), 'seconds') < 2));
        const deferredDelete = setTimeout(() => {
            setMembersWhoTyping(typing.filter(member => moment().diff(moment(member.date), 'seconds') < 2));
        }, 3000);
        return () => {
            clearTimeout(deferredDelete);
        };
    }, [typing]);

    const newMessage = (data) => {
        setMyChats(myChats.map(e => {
            if (data.chatId === e.id) {
                return {...e, last_message: data.message}
            }
            return e;
        }));
        if (!!selectedChat && data.chatId === selectedChat.chatID) {
            setTyping(typing.filter(member => member.username !== data.message.sender_username));
            if (data.message.sender_username === chatConfig.userName) {
                setSelectedChat({
                    ...selectedChat, messages: selectedChat.messages.map(
                        e => {
                            if (!!e.status) {
                                return {...data.message}
                            }
                            return e;
                        }
                    )
                })

            } else {
                setSelectedChat({...selectedChat, messages: [...selectedChat.messages, data.message]})
            }
        }
    };

    useEffect(() => {
        if (authUser) {
            onSnapshot(doc(fb.firestore, 'chat', `${authUser.uid}`), async (doc) => {
                if (doc.data()) {
                    const userData = await chatApi.authenticate({
                        projectID: process.env.REACT_APP_PROJECT_ID,
                        userName: doc.data().userName,
                        userSecret: authUser.uid,
                    });
                    await setMyDetails({...userData,email: authUser.email});
                    setChatConfig({
                        userSecret: authUser.uid,
                        userName: doc.data().userName,
                        projectID: `${process.env.REACT_APP_PROJECT_ID}`,
                    });
                }
            });
        }
    }, [authUser]);


    return (
        <ChatContext.Provider
            value={{
                myChats, setMyChats,
                myDetails, setMyDetails,
                selectedChat, setSelectedChat,
                membersWhoTyping, setMemberIsTyping,
                chatConfig,
                setMembers,
                createNewChat,
                deleteChat,
                newMessage,
                getMessages,
                logout,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const {
        myChats, setMyChats,
        myDetails, setMyDetails,
        selectedChat, setSelectedChat,
        membersWhoTyping, setMemberIsTyping,
        chatConfig,
        setMembers,
        createNewChat,
        deleteChat,
        newMessage,
        getMessages,
        logout,
    } = useContext(ChatContext);

    return {
        myChats, setMyChats,
        myDetails, setMyDetails,
        selectedChat, setSelectedChat,
        setMemberIsTyping,
        membersWhoTyping,
        chatConfig,
        setMembers,
        createNewChat,
        deleteChat,
        newMessage,
        getMessages,
        logout,
    };
};



