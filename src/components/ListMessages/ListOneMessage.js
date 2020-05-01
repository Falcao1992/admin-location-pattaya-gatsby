import React from "react";

const ListOneMessage = (props) => {

    const {keyMessage} = props.match.params;
    const {message} = props.location.state;

    return (
        <>
            <h2>salut votre message ...</h2>
            {console.log(keyMessage)}
            {console.log(message)}

        </>
    )
};

export default ListOneMessage
