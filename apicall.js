const axios = require('axios');
const BaseUrl = "https://analytics.itskillscenter.com/api/";

class ApiCalls {

  constructor(token=null){
    this.token = token;
    this.headers = {
      "Content-Type": "application/json-patch+json",
      "accept": "*/*"
    }
    if(this.token){
      this.headers.authorization = `Bearer ${this.token}`
    }
  }

  getApi = async(url) => {
    try {
      let res = await axios.get(`${BaseUrl}${url}`, {
        headers: this.headers
      })
      return res.data
    } catch(err){
      return err.response.data;
    }
  }

  postApi = async(url, data={}) => {
    console.log(url, data, this.headers)
    try {
      let res = await axios.post(`${BaseUrl}${url}`, data, {
        headers: this.headers,
      })
      console.log(res, "dfsfsd")
      return res.data
    } catch(err){
      console.log(err.response.data);
      return err.response.data
    }
  }

  putApi = async(url, data={}) => {
    try {
      let res = await axios.put(`${BaseUrl}${url}`, data, {
        headers: this.headers,
      })
      return res.data
    } catch(err){
      return err.response.data;
    }
  }

  deleteApi = async(url, data={}) => {
    try {
      let res = await axios.delete(`${BaseUrl}${url}`, data, {
        headers: this.headers,
      })
      return res.data
    } catch(err){
      return err.response.data;
    }
  }
}

module.exports = ApiCalls;