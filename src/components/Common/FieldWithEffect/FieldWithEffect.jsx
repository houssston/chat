import React from 'react';
import cn from "classnames";
import style from "./FieldWithEffect.module.css";

const FieldWithEffect = ({placeholder,value,touched,event, mix}) => {
    return (
        <div className={cn(style.wrapper, {[style.movePlaceholder]: touched}, mix)}>
            <input className={style.field} type="text" value={value}
                   onChange={(e) => event(e.target.value)}
            />
            <label className={style.fieldPlaceholder}>
                {placeholder}
            </label>
        </div>
    );
};

export default FieldWithEffect;
