import React from 'react';
import cn from "classnames";
import style from "./RoundButton.module.css";


const RoundButton = ({event, show = false, children}) => {
    return (
        <div onClick={()=>event()}
             className={cn(style.roundButton, {[style.roundButton_show]:show})}>
            {children}
        </div>
    );
};

export default RoundButton;
