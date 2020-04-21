import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Square from '../components/square';

export default class GameBoard extends Component {
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

function mapStateToProps(state) {
    return {
        gamestate: state.gamestate
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
