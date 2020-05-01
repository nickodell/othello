import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getMyColor, getGamestate, getLegalMoves, playMove, toggleModal } from '../actions/Actions';

import Square from '../components/square';

class GameBoard extends Component {
    // constructor(props) {
    //     super(props);
    //     this.props.getGamestate();
    //     this.props.getLegalMoves(this.props.ofContract);
    // }
    // async componentDidMount() {
    //     await this.props.getGamestate(this.props.ofContract);
    //     await this.props.getLegalMoves(this.props.ofContract);
    // }

    async componentDidUpdate(prevProps) {
        if ((prevProps.ofContract == null) && (this.props.ofContract)) {
            console.log('GAMEBOARD');
            await this.props.getMyColor(this.props.ofContract, this.props.account);
            await this.props.getGamestate(this.props.ofContract);
            await this.props.getLegalMoves(this.props.ofContract);
        }
    }

    render() {
        const board = this.props.gamestate.map((val, i) => {
            if (this.props.legalMoves[i]) {
                return (
                    <div key={i} className="tile" onClick={() => this.props.playMove(i, this.props.ofContract, this.props.account)}>
                        <Square values={2} />
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
            <div className="gameboard">
                {board}
            </div>
        )
    }
}

GameBoard.propTypes = {
    getGamestate: PropTypes.func.isRequired,
    getLegalMoves: PropTypes.func.isRequired,
    gamestate: PropTypes.array.isRequired,
    legalMoves: PropTypes.array,
    myTurn: PropTypes.bool,
    ofContract: PropTypes.object,
    account: PropTypes.string
};

const mapStateToProps = (state) => ({
    gamestate: state.game.gamestate,
    legalMoves: state.game.legalMoves,
    myTurn: state.game.myTurn,
    ofContract: state.web3.ofContract,
    account: state.web3.account
});

export default connect(mapStateToProps, { getMyColor, getGamestate, getLegalMoves, playMove, toggleModal })(GameBoard);
