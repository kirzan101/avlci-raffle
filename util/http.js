import axios from 'axios';

// const link = 'http://192.168.88.23:8000/api/opc-lead-bulk';
// const link = 'http://localhost:8000/api/opc-lead-bulk';
// const link = 'http://10.0.2.2:8000/api/opc-lead-bulk';
// const link = 'https://jsonplaceholder.typicode.com/todos/1';
const link = 'https://leads.avlci.com/api/opc-lead-bulk';

// export function storeLead(leadData) {
//   axios.post(link, leadData);
// }

export async function storeBulkLead(leadDatas) {
  const response = await axios
    .post(link, {
      leads: JSON.stringify(leadDatas),
    })

    return response;
}
