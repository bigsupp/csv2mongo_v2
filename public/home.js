const init = async () => {
  try {
    const resp = await API.get('/modeltarget')
    if(resp && resp.data) {
      const models = resp.data
      console.log('models: ', models);
      $liTemplate = $('<li class="mt-2"><a class="nav-link btn btn-outline-primary text-left"></a></li>')
      models.map(model => {
        const $li = $liTemplate.clone()
        $li.find('a').attr({
          'href': '/' + model.toLowerCase()
        }).html(model)
        $('ul#modelList').append($li)
      })
    }
  } catch (error) {
    handleErrorException(error)
  }
}

$(init)