import React from 'react';

// import images of tiles here

function getIcon(val) {
    // replace strings with icons
    if (val === 0) return '';
    else if (val === 1) return 'legal';
    else if (val === 2) return 'white';
    else return 'black';
}

const Square = (props) => {
    <div>
        {/* replace by image tag */}
        <p>{getIcon(props.values.val)}</p>
    </div>
}

export default Square;
