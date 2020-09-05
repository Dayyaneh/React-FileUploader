import React from "react";
import FileUploader from "./Components/FileUpload/FileUploader";

import './Home.css';

const Home = () => {
    return (<div className='home'>
        <div className='container'>
            <FileUploader></FileUploader>
        </div>
    </div>)
}

export default Home;