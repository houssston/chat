import React, {useRef, useState, useEffect} from 'react';
import {ArrowDown} from "phosphor-react";
import {useChat} from "../../../context/context";
import cn from "classnames";
import Bubble from "./Bubble/Bubble";
import style from "./Bubbles.module.css"
import {groupMessagesByAuthor, groupMessagesByDate} from "../../../helpers/groupMessages";
import {convertDate} from "../../../helpers/dateOutput";
import RoundButton from "../../RoundButton/RoundButton";


const Bubbles = () => {
    const {
        selectedChat,
        getMessages,
    } = useChat();
    const scrollable = useRef(null);
    const messagesEndRef = useRef(null);
    const [scrollBottom, setScrollBottom] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(true);

    const scrollDown = (options = "auto") => {
        messagesEndRef.current?.scrollIntoView({
            behavior: options
        })
    };
    const getNextMessages = async (page) => {
        setIsLoading(true);
        await getMessages(selectedChat.chatData, page);
        setIsLoading(false);
    };

    const scrollListener = () => {
        const scrollHeight = scrollable.current.scrollHeight;
        const scrollTop = scrollable.current.scrollTop;
        const offsetHeight = scrollable.current.offsetHeight;
        const scrollTopMax = scrollTop + offsetHeight;

        if (!!scrollHeight && !!scrollTop && !!offsetHeight) {
            scrollHeight < scrollTopMax + 100
                ? setHasScrolled(true)
                : setHasScrolled(false)
        }
        setScrollBottom(scrollHeight - offsetHeight - scrollTop);
        if (scrollTop <= 300 && !isLoading) {
            if (selectedChat.hasMoreMessage) {
                const nextPage = selectedChat.currentPage + 1;
                getNextMessages(nextPage);
            }
        }
    };

    useEffect(() => {
        const {current: scrollContainer} = scrollable;
        if (selectedChat.currentPage) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.offsetHeight - scrollBottom;
        }

    }, [selectedChat.currentPage]);

    useEffect(() => {
        if (selectedChat.messages) {
            if (hasScrolled) {
                scrollDown('smooth');
            } else {
                if (selectedChat.messages[selectedChat.messages.length - 1].status === "waiting") {
                    scrollDown('smooth');
                }
            }
        }
    }, [selectedChat.messages]);


    useEffect(() => {
        scrollable.current.scrollTop = scrollable.current.scrollHeight;
    }, [selectedChat.chatID]);


    useEffect(() => {
        !!scrollable.current && scrollable.current.addEventListener("scroll", scrollListener);
        return () => {
            !!scrollable.current && scrollable.current.removeEventListener("scroll", scrollListener);
        }
    });

    return (
        <div className={style.scrollable} ref={scrollable}>
            <div className={style.messageList}>
                {!!selectedChat.messages && groupMessagesByDate(selectedChat.messages).map((a, key) => (
                    <div className={style.messageGroupByDate} key={key}>
                        <div className={style.date}>
                                <span>
                                    {convertDate.forChatFeed(a.created)}
                                </span>
                        </div>
                        {groupMessagesByAuthor(a.message).map((b, keyB) => (
                            <Bubble item={b} key={keyB}/>
                        ))}
                    </div>
                ))}
                <span ref={messagesEndRef}> </span>
            </div>
            <RoundButton event={() => scrollDown('smooth')}
                         mix={cn(style.scrollDown, {[style.scrollDown_show]: !hasScrolled})}>
                <ArrowDown size={28} weight="bold"/>
            </RoundButton>

        </div>
    );
};

export default Bubbles;
