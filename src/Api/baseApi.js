import axios from "axios";

const baseApi = axios.create({
    baseURL: "http://localhost/election_system/Digital_Voting_System/backend/public/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

export default baseApi;