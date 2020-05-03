import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getWeb3Instance, getContracts, yourTurnEvent, newGameEvent, forfeitEvent, endGameEvent } from '../actions/Actions';

class Web3Container extends Component {
    async componentDidMount() {
        await this.props.getWeb3Instance();
        console.log('Account: ' + this.props.account);
        await this.props.getContracts(this.props.web3);
    }

    async componentDidUpdate(prevProps) {
        if ((prevProps.ofContract === null) && (this.props.ofContract)) {
            await this.props.yourTurnEvent(this.props.ofContract, this.props.account);
            await this.props.newGameEvent(this.props.ofContract, this.props.account);
            await this.props.forfeitEvent(this.props.ofContract, this.props.account);
            await this.props.endGameEvent(this.props.ofContract, this.props.account);
        }
    }
    render() {
        return null;
    }
}

Web3Container.propTypes = {
    getWeb3Instance: PropTypes.func.isRequired,
    getContracts: PropTypes.func.isRequired,
    yourTurnEvent: PropTypes.func.isRequired,
    newGameEvent: PropTypes.func.isRequired,
    forfeitEvent: PropTypes.func.isRequired,
    endGameEvent: PropTypes.func.isRequired,
    web3: PropTypes.object,
    account: PropTypes.string,
    ofContract: PropTypes.object
};

const mapStateToProps = (state) => ({
    web3: state.web3.web3,
    account: state.web3.account,
    ofContract: state.web3.ofContract
});

export default connect(mapStateToProps, { getWeb3Instance, getContracts, yourTurnEvent, newGameEvent, forfeitEvent, endGameEvent })(Web3Container);
