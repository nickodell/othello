import React from 'react';

// import images of tiles here

function getIcon(val) {
    // replace strings with icons
    if (val === 0) return 'illegal';
    else if (val === 1) return 'legal';
    else if (val === 2) return 'white';
    else if (val === 3) return 'black';
    else return 'error';
}

// TODO: replace <p> by <img>
const Square = (props) => (
    <p>{getIcon(props.values)}</p>
);

export default Square;
