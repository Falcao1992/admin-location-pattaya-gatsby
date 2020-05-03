import React from "react";
import moment from "moment";

const ListOneMessage = (props) => {
    //const {keyMessage} = props.match.params;
    const {message} = props.location.state;

    return (
        <>
            <h2>salut votre message ...</h2>
            <p>{moment(message.dateMessage).fromNow()}</p>
            {console.log(message)}
            { message && Object.entries(message).map(([key, msg]) => {
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
