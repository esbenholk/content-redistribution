import axios from "axios";

var instance = axios.create({
    xsrfCookieName: "customCSURFtoken",
    xsrfHeaderName: "csrf-token"
});

export default instance;
