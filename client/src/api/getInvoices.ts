import axios from 'axios';

export async function getInvoices() {
  try {
    console.log('getInvoices');
    const res = await axios.get('/api/invoices');
    return res?.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

