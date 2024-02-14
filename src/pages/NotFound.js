import React from 'react';
import Layout from './Layout';

function NotFound() {
    return (
        <Layout>
            <div className="container mx-auto mt-8 flex justify-center items-center">
            <img src="/Images/404.png" className="" alt="404 not found" />
            </div>
        </Layout>
    );
}

export default NotFound;
