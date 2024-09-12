import React from 'react';
import { useRouteError } from 'react-router-dom';

const Error = () => {
    const error = useRouteError();
    console.log(error);

    return (
        <div id="error-page">
            <h2>Uh oh! An error has occurred.</h2>
            <p>{error.status}</p>
            <p><i>{error.response.data.error || error.message}</i></p>
        </div>
    );
}

export default Error;
