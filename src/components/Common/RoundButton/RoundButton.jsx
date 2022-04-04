import React from 'react';
import cn from "classnames";
import style from "./RoundButton.module.css";


const RoundButton = ({event, visibility, mix, children}) => {
    return (
        <div onClick={()=>event()}
             className={cn(style.default, {[style.default_hide]:visibility}, mix)}>
            {children}
        </div>
    );
};

export default RoundButton;
