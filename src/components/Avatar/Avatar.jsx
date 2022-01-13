import React from 'react';
import style from './Avatar.module.css'
import cn from "classnames";
import randomColor from "randomcolor";

const Avatar = ({str, size = `medium`, mix, children}) => {
    return (
        <div className={cn(style.container,
            {[style.avatar_sizeLarge]: size === `large`},
            {[style.avatar_sizeMedium]: size === `medium`},
            {[style.avatar_sizeSmall]: size === `small`}, mix
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
