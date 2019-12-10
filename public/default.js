const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'x-custom-dcs-app': 'csv2mongo'
  }
})
API.interceptors.response.use((resp) => {
  return {
    data: resp.data,
    status: resp.status,
    statusText: resp.statusText
  }
}, (err) => {
  if (err.response) {
    return {
      data: err.response.data,
      status: err.response.status
    }
  } else if (err.request) {
    return err.request
  } else {
    return {
      message: err.message
    }
  }
})

const handleErrorException = (error) => {
  alert(`ERROR: ${error.message ? error.message : "unknown error"}`)
  console.log('ERROR:', error)
}