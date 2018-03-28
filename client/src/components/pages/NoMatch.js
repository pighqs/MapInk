import React from 'react';
import styled from "styled-components";

// antd
import { Layout } from "antd";


const NoMatch = () => {
    const StyledLayout = styled(Layout)`
    min-height: 100vh;
    `
    return (
        <StyledLayout>
            <h1>404</h1>
            <div>Page not found :(</div>
        </StyledLayout>
    );
};

export default NoMatch;