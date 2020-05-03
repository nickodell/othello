import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentState, enterName, createNewGame } from '../actions/Actions';

class Lander extends Component {
    async componentDidUpdate(prevProps) {
        if ((prevProps.ofContract === null) && (this.props.ofContract)) {
            await this.props.getCurrentState(this.props.ofContract, this.props.account);
        }
    }

    render() {
        let displayThis = null;
        if (this.props.currentState === 'IDLE') {
            displayThis = (
                <form onSubmit={ async () => await this.props.createNewGame(this.props.ofContract, this.props.account, this.props.name) }>
                    <input type="text" placeholder="Your name here" value={this.props.name} onChange={(e) => this.props.enterName(e.target.value)} className="nameInput" />
                    <button type="submit" className="btn">Submit</button>
                </form>
            );
        } else if (this.props.currentState === 'MATCHMAKING') {
            displayThis = (
                <p>You are currently in the waitlist, your game will begin as soon as another player joins</p>
            );
        } else if (this.props.currentState === 'IN_GAME') {
            displayThis = (
                <p>Getting your game, please wait...</p>
            );
        } else {
            displayThis = (
                <p>Loading, please wait...</p>
            );
        }
        return (
            <div className="lander">
                {displayThis}
            </div>
        )
    }
}

Lander.propTypes = {
    createNewGame: PropTypes.func.isRequired,
    currentState: PropTypes.string.isRequired,
    name: PropTypes.string,
    gameCreated: PropTypes.bool
};

const mapStateToProps = (state) => ({
    currentState: state.lander.currentState,
    name: state.lander.name,
    gameCreated: state.lander.gameCreated,
    ofContract: state.web3.ofContract,
    account: state.web3.account
});

export default connect(mapStateToProps, { getCurrentState, enterName, createNewGame })(Lander)
