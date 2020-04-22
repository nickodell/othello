import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getGamestate, getLegalMoves } from '../actions/Actions';

import Square from '../components/square';

class GameBoard extends Component {
    componentDidMount() {
        this.props.getGamestate();
    }

    render() {
        const board = this.props.gamestate.map((val, i) => {
            // use css grid to display in 8x8
            <Square values={val} />
        });
        return (
            <div>
                {board}
            </div>
        )
    }
}

GameBoard.propTypes = {
    getGamestate: PropTypes.func.isRequired,
    getLegalMoves: PropTypes.func.isRequired,
    gamestate: PropTypes.array.isRequired,
    legalMoves: PropTypes.array
};

const mapStateToProps = (state) => ({
    gamestate: state.game.gamestate,
    legalMoves: state.game.legalMoves
});

export default connect(mapStateToProps, { getGamestate, getLegalMoves })(GameBoard);
