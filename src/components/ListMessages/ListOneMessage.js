import React from "react";

const ListOneMessage = (props) => {

    const {keyMessage} = props.match.params;
    const {message} = props.location.state;

    return (
        <>
            <h2>salut votre message ...</h2>
            {console.log(keyMessage)}
            {console.log(Object.entries(message))}
            {Object.entries(message).map(([key, msg]) => {
                        return (
                            <div key={key}>
                                <h4>{key}</h4>
                                <p>{msg}</p>
                            </div>
                        )
                    })
                }

        </>
    )
};

export default ListOneMessage
