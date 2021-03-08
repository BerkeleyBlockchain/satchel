import React, { useState, useEffect } from 'react';
import NavBar from './NavBar.js'

function Test() {
    return (
        <>
            <div >
                <NavBar Balance={500} Withdraw={300} Name='Melissa' activeTab={0}/>
            </div>
        </>
    );
}

export default Test;
