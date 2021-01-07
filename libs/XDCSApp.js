module.exports = (req, res, next) => {
  if(req.get('X-Custom-DCSApp-BaseURL')) {
    const prefixBaseURL = req.get('X-Custom-DCSApp-BaseURL') || ''
    let apiBaseUrlWithoutProtocol = process.env.API_BASEURL || `http://localhost:${process.env.PORT || 8100}`
    apiBaseUrlWithoutProtocol = apiBaseUrlWithoutProtocol.replace(/http:\/\//ig, '')
    if(apiBaseUrlWithoutProtocol.indexOf('/')===0) {
      req.app.locals.baseURL = prefixBaseURL + apiBaseUrlWithoutProtocol
    } else {
      req.app.locals.baseURL = prefixBaseURL + apiBaseUrlWithoutProtocol.replace(/^(([a-zA-Z0-9])\.?)+(:\d+)?/, '') || `${prefixBaseURL}`
    }
  } else {
    req.app.locals.baseURL = process.env.API_BASEURL || `http://localhost:${process.env.PORT || 8100}`
  }
  if(process.env.NODE_ENV==='development') {
    console.log(req.method, req.originalUrl)
    console.log('X-Custom-DCSApp-BaseURL:', req.get('X-Custom-DCSApp-BaseURL'))
    console.log('req.app.locals.baseURL: ', req.app.locals.baseURL)
  }
  next()
}