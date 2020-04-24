import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getGamestate, getLegalMoves } from '../actions/Actions';

import Square from '../components/square';

class GameBoard extends Component {
    componentDidMount() {
        this.props.getGamestate();
        this.props.getLegalMoves();
    }

    render() {
        console.log(this.props);
        const board = this.props.gamestate.map((val, i) => {
            if (this.props.legalMoves.includes(i)) {
                return (
                    <div key={i} className="tile">
                        <Square values={1} />
                    </div>
                );
            } else {
                return (
                    <div key={i} className="tile">
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
    legalMoves: PropTypes.array
};

const mapStateToProps = (state) => ({
    gamestate: state.game.gamestate,
    legalMoves: state.game.legalMoves
});

export default connect(mapStateToProps, { getGamestate, getLegalMoves })(GameBoard);
