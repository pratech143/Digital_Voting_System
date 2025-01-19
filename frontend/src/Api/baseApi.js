import axios from "axios";

const baseApi = axios.create({
    baseURL: "http://localhost/Digital-Voting-System/backend/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

export default baseApi;