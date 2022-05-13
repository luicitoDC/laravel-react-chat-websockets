
export default {
  baseUrl: process.env.MIX_APP_ENV === 'production' ? 'https://howtochatapp.ml/api' : 'http://localhost:8000/api',
  axiosConfig: {
    validateStatus: function (status) {
      return true
    },
  }
}