import React from 'react';
import { useRouteError } from 'react-router-dom';

function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Oops! Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist or an unexpected error has occurred.</p>
            {error && (
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            )}
            <a href="/">Go back to Home</a>
        </div>
    );
}

export default ErrorPage;
