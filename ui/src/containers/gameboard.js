import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getMyColor, getGamestate, getLegalMoves, playMove, passMove, forfeitGame, toggleModal } from '../actions/Actions';

import Square from '../components/square';

class GameBoard extends Component {
    async componentDidMount() {
        await this.props.getMyColor(this.props.ofContract, this.props.account);
        await this.props.getGamestate(this.props.ofContract, this.props.account);
        await this.props.getLegalMoves(this.props.ofContract, this.props.account);
    }

    async componentDidUpdate(prevProps) {
        if ((!prevProps.myTurn) && (this.props.myTurn)) {
            await this.props.getGamestate(this.props.ofContract, this.props.account);
            await this.props.getLegalMoves(this.props.ofContract, this.props.account)
        }
        if (this.props.gameResult) {
            this.props.toggleModal(this.props.gameResult);
        }
        if ((!prevProps.myTurn) && (this.props.myTurn) && (this.props.legalMoves.includes(true))) {
            this.props.passMove(this.props.ofContract, this.props.account);
        }
        if ((!prevProps.gameResult) && (this.props.gameResult)) {
            this.props.toggleModal(this.props.gameResult);
        }
    }

    render() {
        const board = this.props.gamestate.map((val, i) => {
            if ((this.props.legalMoves[i] == 1) && (!this.props.myTurn)) {
                return (
                    <div key={i} className="tile" onClick={() => this.props.playMove(i, this.props.ofContract, this.props.account)}>
                        <Square values={"2"} />
                    </div>
                );
            } else {
                return (
                    <div key={i} className="tile" onClick={() => this.props.toggleModal(val)}>
                        <Square values={val} />
                    </div>
                );
            }
        });
        return (
            <Fragment>
                <div className="gameboard">
                    {board}
                </div>
                <div className="rightBar">
                    <button className="btn" onClick={() => this.props.forfeitGame(this.props.ofContract, this.props.account)}>Forfeit</button>
                </div>
            </Fragment>
        )
    }
}

GameBoard.propTypes = {
    getGamestate: PropTypes.func.isRequired,
    getLegalMoves: PropTypes.func.isRequired,
    gamestate: PropTypes.array.isRequired,
    legalMoves: PropTypes.array.isRequired,
    myTurn: PropTypes.bool,
    gameResult: PropTypes.string,
    ofContract: PropTypes.object,
    account: PropTypes.string
};

const mapStateToProps = (state) => ({
    gamestate: state.game.gamestate,
    legalMoves: state.game.legalMoves,
    myTurn: state.game.myTurn,
    gameResult: state.game.gameResult,
    ofContract: state.web3.ofContract,
    account: state.web3.account
});

export default connect(mapStateToProps, { getMyColor, getGamestate, getLegalMoves, playMove, passMove, forfeitGame, toggleModal })(GameBoard);
