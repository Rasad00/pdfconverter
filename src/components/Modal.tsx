import React from "react";
import { createPortal } from "react-dom";

interface IModal extends React.DetailedHTMLProps<any, any> {
    open: boolean;
}

const Modal: React.FC<IModal> = ({ open = false, children, ...attr }) => {
    if(!open) return null;

    return createPortal(
        <>
            <div className="overlay"></div>
            <div className="modal" { ...attr }>
                { children }
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    );
}


export default Modal;