import React,{useEffect, useState, useContext} from 'react';
import {fb} from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";




export const ChatContext = React.createContext();

export const ChatProvider = ({children, authUser}) => {

    const [chatConfig, setChatConfig] = useState(null);
    const [myChats, setMyChats] = useState(null);



    useEffect(() => {
        if (authUser) {
            onSnapshot(doc(fb.firestore, 'chat', `${authUser.uid}`), (doc) => {
                setChatConfig({
                    userSecret: authUser.uid,
                    userName: doc.data().userName,
                    projectID: `${process.env.REACT_APP_PROJECT_ID}`,
                });
            });
        }
    }, [authUser]);


    return (
        <ChatContext.Provider
            value={{
                chatConfig,
                setMyChats,
                myChats
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const {
        chatConfig,
        setMyChats,
        myChats
    } = useContext(ChatContext);

    return {
        chatConfig,
        setMyChats,
        myChats
    };
};



