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
        console.log(this.props);
        const board = this.props.gamestate.map((val, i) => (
            <div key={i} className="tiles">
                <Square values={val} />
            </div>
        ));
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
    legalMoves: PropTypes.array
};

const mapStateToProps = (state) => ({
    gamestate: state.game.gamestate,
    legalMoves: state.game.legalMoves
});

export default connect(mapStateToProps, { getGamestate, getLegalMoves })(GameBoard);
