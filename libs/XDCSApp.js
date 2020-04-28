module.exports = (req, res, next) => {
  if(process.env.NODE_ENV==='development') {
    console.log(req.method, req.originalUrl)
    console.log('X-Custom-DCSApp-BaseURL:', req.get('X-Custom-DCSApp-BaseURL'))
  }
  if(req.get('X-Custom-DCSApp-BaseURL')) {
    const prefixBaseURL = req.get('X-Custom-DCSApp-BaseURL') || ''
    const apiBaseUrlWithoutProtocol = process.env.API_BASEURL.replace(/http:\/\//ig, '')
    if(apiBaseUrlWithoutProtocol.indexOf('/')===0) {
      app.locals.baseURL = prefixBaseURL + apiBaseUrlWithoutProtocol
    } else {
      app.locals.baseURL = prefixBaseURL + apiBaseUrlWithoutProtocol.replace(/^(([a-zA-Z0-9])+\.?)(:\d+)?/, '') || `${prefixBaseURL}/api`
    }
  } else {
    app.locals.baseURL = process.env.API_BASEURL || `/api`
  }
  next()
}