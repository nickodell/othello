import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleModal } from '../actions/Actions';

class Modal extends Component {
    render() {
        const modalText = {
            '0': 'Illegal move, please select from the provided legal moves.',
            '1': 'Black',
            '2': '',
            '3': 'White',
            'WINNER': 'Winner winner, chicken dinner!',
            'LOSER': 'You\'ve lost :(',
            'DRAW': 'Game was a draw!'
        };

        let modalDiv = null;
        if (this.props.showModal) {
            modalDiv = (
                <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) this.props.toggleModal()}}>
                    <div className="modalContent">
                        {modalText[this.props.tileValue]}
                    </div>
                </div>
            );
        }
        return modalDiv;
    }
}

Modal.propTypes = {
    showModal: PropTypes.bool,
    tileValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

const mapStateToProps = (state) => ({
    showModal: state.modal.showModal,
    tileValue: state.modal.tileValue
});

export default connect(mapStateToProps, { toggleModal })(Modal);
