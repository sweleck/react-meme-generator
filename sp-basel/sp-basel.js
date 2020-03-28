import React from "react"
import ReactDOM from "react-dom"
import ReactMemeGenerator from "../src"
import {LocaleProvider} from "antd"
import de_DE from 'antd/lib/locale-provider/de_DE'

import "../src/styles/index.less"
import "./sp-basel.less"


const Demo = () => (
    <LocaleProvider locale={de_DE}>
        <ReactMemeGenerator />
    </LocaleProvider>
)
ReactDOM.render(
    <Demo/>,
    document.getElementById('root')
)
