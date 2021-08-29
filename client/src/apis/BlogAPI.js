import axios from "axios";
const config = require('../config.json');

const port = config.server_url;

let blogAxios = axios.create({
	baseURL: `${port}/api/blog`,
	headers: {'Authorization': "Bearer " + window.localStorage.getItem('token')}
})

export default blogAxios;
