import { Redirect } from 'expo-router';
import React from 'react';


const index = () => {
        return (
           <Redirect href="/album" />
        );
    
};

export default index;