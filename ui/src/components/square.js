import React from 'react';

import white from '../assets/img/white.svg';
import black from '../assets/img/black.svg';
import legal from '../assets/img/legal.svg';

const whitePng = <img src={white} className="tileImage" alt="white" />
const blackPng = <img src={black} className="tileImage" alt="black" />
const legalPng = <img src={legal} className="tileImage" alt="legal" />

function getIcon(val) {
    // replace strings with icons
    if (val === 0) return '';
    else if (val === 2) return legalPng;
    else if (val === 1) return whitePng;
    else if (val === 3) return blackPng;
    else return 'error';
}

// TODO: replace <p> by <img>
const Square = (props) => (
    getIcon(props.values)
);

export default Square;
