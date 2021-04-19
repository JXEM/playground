import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export default createGlobalStyle`
    ${reset};
    *{
        box-sizing: border-box;
    }
    html, body{
        height: 100%;
        width: 100vw;
        font-size: 16px;
        /* font-size: ${(props) => props.bodyFont}; */
        font-family: Arial, Helvetica, sans-serif;
        /* disable bounce safari/ios */
        /* position: fixed; */
    }
    a{
        text-decoration: none;
    }
    input:focus{
        outline: none;
    }
    input[type="range"]{
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        height: 3px;
        outline: none;
    }
    input[type="range"]::-webkit-slider-thumb{
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid #d3d3d3;
        background: white;
        cursor: pointer;
    }
    input[type="range"]::-moz-range-thumb{
        
    }
`;
