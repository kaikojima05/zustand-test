import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import type {} from '@redux-devtools/extension';
import {useShallow} from "zustand/react/shallow";
import React, {useState} from 'react';

interface AppProps {
}

interface Store {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

const useStore = create<Store>()(
    devtools(
        persist(
            (set) => ({
                count: 0,
                increment: () => set(state => ({count: state.count + 1})),
                decrement: () => set(state => ({count: state.count - 1})),
                reset: () => set({count: 0}),
            }),
            {
                name: 'zustand-react-typescript-base',
            }
        ),
    ),)

const App: React.FC<AppProps> = () => {
    const {count, increment, decrement} = useStore()

    return (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>React TypeScript Base</h1>
            <p>This is a minimal React TypeScript setup.</p>
            <div>
                <p>Count: {count}</p>
                <button onClick={increment}>Increment</button>
                <button onClick={decrement} style={{
                    marginLeft: '10px',
                }}>Decrement
                </button>
            </div>
        </div>
    );
};

export default App;