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

/**
 * Zustand における `useStore` の注意点と `useShallow` の使い分けまとめ
 *
 * ✅ 基本原則
 * Zustand は「どの state を購読するか」をセレクタ関数で明示することで、
 * 不要な再レンダリングを防ぐ「ファイン・グレイン制御」が可能。
 *
 * ❌ アンチパターン
 *   const state = useStore(); // store 全体を購読（全ての更新で再レンダリング）
 *
 * ✅ 正しい書き方（購読対象を限定）
 *   const count = useStore((state) => state.count);
 *
 * ✅ 複数値を使う場合は `useShallow` を使って浅い比較
 *
 * ✅ なぜ useShallow が必要か？
 * ```jsx
 * function ComponentA {
 *   const valueA = useStore()
 *   // valueA をゴニョゴニョ
 * }
 *
 * function ComponentB {
 *   const valueB = useStore()
 *   // valueB をゴニョゴニョ
 * }
 * ```
 * 上記で無駄な再レンダリングが発生する
 * セレクタを指定せずに useStore() を使ってしまうと、zustand は store で管理しているどれかの state に変化があった場合に React に通知してしまう
 * つまり、valueB を更新しただけ（ComponentB を再レンダリングしたい）なのに、valueA を使用している ComponentA まで再レンダリングされてしまう
 *
 * ✅ セレクタを使って購読を限定すれば、
 * 関係ない state の変更で再レンダリングされることを防げる。
 *
 * ✅ 状況別ベストプラクティス
 * - 単一の値だけ必要ならセレクタ関数で取り出す
 * - 複数の値をオブジェクトでまとめて使う場合は useShallow を併用
 * - useStore() のみの呼び出しは基本避ける（開発中の仮利用を除く）
 *
 */
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
    // useStore() を呼び出した時点で App コンポーネントを zustand が監視する
    // store 内の変更を検知して、変更があった場合には React に通知 → 再レンダリングされる
    // useShallow を使用することで、zustand がオブジェクトの一階層までのプロパティの変更後と比較する（名前は似ているが、シャローコピーとは違う）
    const {count, increment, decrement} = useStore(
        useShallow((state) => ({count: state.count, increment: state.increment, decrement: state.decrement}))
    )

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