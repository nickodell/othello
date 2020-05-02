import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getWeb3Instance, getContracts, yourTurn } from '../actions/Actions';

class Web3Container extends Component {
    async componentDidMount() {
        await this.props.getWeb3Instance();
        console.log('Account: ' + this.props.account);
        await this.props.getContracts(this.props.web3);
    }

    async componentDidUpdate(prevProps) {
        if ((prevProps.ofContract === null) && (this.props.ofContract)) {
            await this.props.yourTurn(this.props.ofContract, this.props.account);
        }
    }
    render() {
        return null;
    }
}

Web3Container.propTypes = {
    getWeb3Instance: PropTypes.func.isRequired,
    getContracts: PropTypes.func.isRequired,
    web3: PropTypes.object,
    account: PropTypes.string,
    ofContract: PropTypes.object
};

const mapStateToProps = (state) => ({
    web3: state.web3.web3,
    account: state.web3.account,
    ofContract: state.web3.ofContract
});

export default connect(mapStateToProps, { getWeb3Instance, getContracts, yourTurn })(Web3Container);
