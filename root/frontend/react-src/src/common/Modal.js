import React from 'react';
import { CSSTransition } from 'react-transition-group';

import Portal from './Portal';
import './Modal.css';

// since 3rd party apps like to render to body, we don't want to render to body.
// Everything renders to body and if we render to body, it could break our app.
// We want to render to a div that is a child of body (root).

const fadeDuration = 300;
const modalDuration = 300;
const modalFadeClasses = {
    enter: 'fade-show',
    enterActive: 'fade-show',
    enterDone: 'fade-show',
    exit: 'fade-hide',
    exitActive: 'fade-hide',
    exitDone: 'fade-hide',
    appearActive: 'fade-show'
};
const backdropFadeClasses = {
    enter: 'modal-backdrop-show',
    enterActive: 'modal-backdrop-show',
    enterDone: 'modal-backdrop-show',
    exit: 'modal-backdrop-hide',
    exitActive: 'modal-backdrop-hide',
    exitDone: 'modal-backdrop-hide',
    appearActive: 'modal-backdrop-show'
};

class Modal extends React.Component {
    constructor(){
        super();
        this.state = {
            in: false,
            content: null,
            modalProps: {},
        };
        this._modalDialog = null;
        this.setModalDialogRef = e => {
            this._modalDialog = e;
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.in && !prevState.in){
            return {
                in: nextProps.in,
                content: nextProps.content,
                modalProps: nextProps.modalProps,
            };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.in && !prevState.in && this._modalDialog) {
            if(this._modalDialog){
                this._modalDialog.parentNode.focus();
            }
            document.body.classList.add("modal-open");
        }
    }

    onClosed = () => {
        this.setState({
            in: false,
            content: null,
            modalProps: {},
        })
        document.body.classList.remove("modal-open");
    }

    handleBackdropClick = e => {
        if(this._modalDialog && !this._modalDialog.contains(e.target)){
            this.props.hideModal(e);
        }
    }

    handleEscape = e => {
        if(this.props.in && e.keyCode === 27){
            this.props.hideModal(e);
        }
    }

    render(){
        const ModalContent = this.state.content;
        if(this.state.in){
            return (
                <Portal>
                    <div>
                        {/* modal window */}
                        <CSSTransition
                            in={this.props.in}
                            timeout={modalDuration}
                            onExited={this.onClosed}
                            classNames={modalFadeClasses}
                            className="modal"
                            role="dialog"
                            onClick={this.handleBackdropClick}
                            onKeyDown={this.handleEscape}
                            tabIndex="-1"
                            appear
                        >
                            <div className="modal">
                                <div className="modal-dialog"
                                    role="document"
                                    ref={this.setModalDialogRef}
                                >
                                    <ModalContent
                                        {...this.state.modalProps}
                                        hideModal={this.props.hideModal}
                                    />
                                </div>
                            </div>
                        </CSSTransition>

                        {/* backdrop */}
                        <CSSTransition
                            in={this.props.in}
                            timeout={fadeDuration}
                            classNames={backdropFadeClasses}
                            appear
                        >
                            <div className="modal-backdrop"/>
                        </CSSTransition>
                    </div>
                </Portal>
            );
        } else {
            return null;
        }
    }
}

export default Modal;