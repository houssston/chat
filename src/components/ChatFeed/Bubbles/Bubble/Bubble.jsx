import React from 'react';
import randomColor from "randomcolor";
import {dateOutput} from "../../../../helpers/dateOutput";
import {useChat} from "../../../../context/context";
import style from "./Bubble.module.css"

const Bubble = ({item}) => {

    const {chatConfig} = useChat();

    return (
        <div className={style.messageItem} key={item.id}
             style={{alignSelf: `${chatConfig.userName !== item.sender.username ? 'flex-start' : 'flex-end'}`}}>

            {chatConfig.userName !== item.sender.username &&
            <div className={style.senderAvatar} style={{
                backgroundColor: `${randomColor({
                    luminosity: 'light',
                    seed: item.sender.first_name.charCodeAt(0)
                })}`
            }}>
                {item.sender.first_name.substring(0, 1).toUpperCase()}
            </div>
            }

            <div className={style.bubbleContent}
                 style={{padding: `${chatConfig.userName !== item.sender.username ? '6px 10px 6px 8px' : '6px 8px 6px 10px'}`}}>

                {chatConfig.userName !== item.sender.username &&
                <div className={style.senderName}>{item.sender.first_name}</div>
                }

                <div className={style.message}>
                    {item.text.replace(/^<p>+|<\/p>$/g, '')}
                    <div> {!!item.created && dateOutput(item.created)}</div>
                </div>
            </div>
        </div>
    );
};

export default Bubble;
