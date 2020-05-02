import React, { Component } from 'react';
import { connect } from 'react-redux';

import GameBoard from './gameboard';
import Lander from './lander';

export class AppComponent extends Component {
    render() {
        let displayThis = <Lander />;
        if (this.props.currentState === 'IN_GAME') {
            displayThis = <GameBoard />;
        }
        return displayThis;
    }
}

const mapStateToProps = (state) => ({
    currentState: state.lander.currentState
});

export default connect(mapStateToProps, {})(AppComponent)
