import axios from "axios";

const baseApi = axios.create({
    baseURL: "http://localhost/election_system/Digital_Voting_System/backend/public/",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

export default baseApi;