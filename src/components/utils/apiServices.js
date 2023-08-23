import axios from "axios";

export const fetchApplicantList = async (moimId) => {
    try {
        const response = await axios.post(`http://localhost:9000/moimReg/get-applicant-list/${moimId}`, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
            }
        });

        if (response.data) {
            return response.data;
        }
        return [];
    } catch (e) {
        console.error("Error fetching applicant list data", e);
        return [];
    }
};