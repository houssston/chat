import React from 'react';
import style from './Avatar.module.css'
import cn from "classnames";
import randomColor from "randomcolor";

const Avatar = ({str, size = `medium`, mix, children}) => {
    return (
        <div className={cn(style.container,
            {[style.sizeLarge]: size === `large`},
            {[style.sizeMedium]: size === `medium`},
            {[style.sizeSmall]: size === `small`}, mix
        )
        }
             style={{
                 background: `linear-gradient(#ffffff -125%, ${randomColor({
                     luminosity: 'light',
                     seed: str.charCodeAt(0)
                 })}`
             }}
        >
            {children}
        </div>
    );
};

export default Avatar;
