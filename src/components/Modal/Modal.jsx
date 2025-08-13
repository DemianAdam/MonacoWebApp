import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Modal.css';

export default function Modal({ content, show, onHide }) {
    const nodeRef = useRef(null);
    const contentRef = useRef(null);

    const handleClickOutside = (e) => {
        // If clicked directly on the overlay (not inside the modal content)
        if (e.target === nodeRef.current) {
            onHide?.();
        }
    };

    return (
        <CSSTransition
            in={show}
            timeout={300}
            classNames="modal"
            unmountOnExit
            nodeRef={nodeRef}
        >
            <div
                ref={nodeRef}
                onClick={handleClickOutside}
                className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center"
            >
                <div
                    ref={contentRef}
                    className=" p-6 rounded-lg shadow-lg"
                    onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
                >
                    {content.body}
                </div>
            </div>
        </CSSTransition>
    );
}
