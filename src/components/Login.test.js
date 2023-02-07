import React from 'react';
import {render} from '@testing-library/react';
import Login from './Login';

describe('Test for Login', () => {
    test('Test Rendering', () => {
        const {queryByTestId} = render(<Login />)
        expect(queryByTestId(document.documentElement, 'content')).toBeInTheDocument
        expect(queryByTestId(document.documentElement, 'header')).toBeInTheDocument
        expect(queryByTestId(document.documentElement, 'login-form')).toBeInTheDocument
    })
})