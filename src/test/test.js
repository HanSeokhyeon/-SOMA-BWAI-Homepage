import React from 'react';
import a from './1.svg';
import b from './2.svg';
import c from './3.svg';
import d from './4.svg';

export default function test() {
    return <>
        <div style={{background: "#000", marginTop: "72px"}}>
            <p>img</p>
            <img style={ss} src={a} alt=""></img>
            <img style={ss} src={b} alt=""></img>
            <img style={ss} src={c} alt=""></img>
            <img style={ss} src={d} alt=""></img>

            <p>embed</p>
            <embed style={ss} src={a} alt="" type="image/svg+xml"></embed>
            <embed style={ss} src={b} alt="" type="image/svg+xml"></embed>
            <embed style={ss} src={c} alt="" type="image/svg+xml"></embed>
            <embed style={ss} src={d} alt="" type="image/svg+xml"></embed>

            <p>object</p>
            <object data={a} type="image/svg+xml" aria-label="킹 (체스 말)"></object>
            <object data={b} type="image/svg+xml" aria-label="킹 (체스 말)"></object>
            <object data={c} type="image/svg+xml" aria-label="킹 (체스 말)"></object>
            <object data={d} type="image/svg+xml" aria-label="킹 (체스 말)"></object>
        </div>
    </>
}

const ss = {
    width: "100%"
}