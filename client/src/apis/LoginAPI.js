import axios from "axios";
const config = require('../config.json');

const port = config.server_url;

export default axios.create({
    baseURL: `${port}/api/login`
});