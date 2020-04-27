import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getWeb3Instance } from '../actions/Actions';

class Web3Container extends Component {
    async componentDidMount() {
        await this.props.getWeb3Instance();
        console.log('Account: ' + this.props.account);
        console.log('Network ID: ' + this.props.networkId) 
    }
    render() {
        return null;
    }
}

Web3Container.propTypes = {
    getWeb3Instance: PropTypes.func.isRequired,
    account: PropTypes.string,
    networkId: PropTypes.number
};

const mapStateToProps = (state) => ({
    account: state.web3.account,
    networkId: state.web3.networkId
});

export default connect(mapStateToProps, { getWeb3Instance })(Web3Container);
