import React, {useState,} from 'react';

import {convertDate} from "../../../../helpers/dateOutput";
import {useChat} from "../../../../context/context";
import style from "./Bubble.module.css"
import Avatar from "../../../Avatar/Avatar";
import cn from "classnames";
import randomColor from "randomcolor";
import {Check} from "phosphor-react";
import {getColorForString} from "generate-colors";

const Bubble = ({item}) => {

    const {
        myDetails,
    } = useChat();

    const rgb = getColorForString(item[0].sender.username, {
        brightness: (defaultValue) => {
            if (defaultValue <= 60) return 60;
            if (defaultValue >= 90) return 90;
            return defaultValue
        },
        saturation: (defaultValue) => {
            if (defaultValue <= 60) return 60;
            return defaultValue
        },
    }).join(',');

    const [messageFromMe] = useState(myDetails.username === item[0].sender.username);

    return (
        <div className={cn(style.messageItem, messageFromMe ? style.messageItem_fromMe : style.messageItem_fromThem)}
        >

            {!messageFromMe &&
            <Avatar str={item[0].sender.username} size={`small`} mix={style.senderAvatar}>
                {!!item[0].sender.avatar
                    ? <img src={item[0].sender.avatar} alt="Avatar"/>
                    : (!!item[0].sender.first_name || !!item[0].sender.last_name
                            ? item[0].sender.first_name.substring(0, 1).toUpperCase() + item[0].sender.last_name.substring(0, 1).toUpperCase()
                            : item[0].sender.username.substring(0, 1).toUpperCase()
                    )
                }
            </Avatar>
            }

            <div className={style.content}>
                {
                    item.map((message, id) => (
                        <div className={style.message} key={id}>
                            {
                                id === 0 && !messageFromMe &&
                                <div className={style.senderName}
                                     style={{
                                         color:  `rgb(${rgb})`
                                     }}
                                >
                                    {!!message.sender.first_name || !!message.sender.last_name
                                        ? message.sender.first_name + " " + message.sender.last_name
                                        : message.sender.username}
                                </div>
                            }
                            <div className={style.messageContent}>
                                {message.text.replace(/@space@/g, `${'\u00A0'}`).replace(/@lb@/g, `${'\n'}`)}
                                <div className={style.messageMeta}>
                                    {!!message.created && convertDate.forBubble(message.created)}
                                    {messageFromMe && (
                                        !!message.status
                                        ? <Check size={16} color="#949494"/>
                                        : <Check size={16} color="#07ae4e"/>
                                    )}
                                </div>
                                {
                                    item.length - 1 === id &&
                                    <div className={style.svg}>
                                        <svg width="14" height="17" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path
                                                    d="M 0 0 L 6 0 L 6 4 C 7 15 10.5 15 13.5 16.5 C 6 16.5 2 16 0 5"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                }

                            </div>


                        </div>
                    ))
                }

                {/*{chatConfig.userName !== item.sender.username &&
                <div className={style.senderName}>{item.sender.first_name}</div>
                }

                <div className={style.message}>
                    {item.text.replace(/^<p>+|<\/p>$/g, '')}
                    <div> {!!item.created && dateOutput(item.created)}</div>
                </div>*/}
            </div>
        </div>
    );
};

export default Bubble;
