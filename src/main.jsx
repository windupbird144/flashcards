import { render } from 'preact'
import { App } from './app'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'

render(<App />, document.getElementById('app'))
