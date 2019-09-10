import React from 'react';

const LoginContext = React.createContext(
    {
        username: '', 
        login: false,
    }
)

export default LoginContext