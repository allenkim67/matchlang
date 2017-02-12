import axios from 'axios'
import config from '../global-config'

export default axios.create({baseURL: config.baseUrl})