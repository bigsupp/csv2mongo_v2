const init = async () => {
  try {
    const resp = await API.get('/modeltarget')
    if (resp && resp.data) {
      const models = resp.data
      console.log('models: ', models);
      const $itemTemplate = $(`<div class="col-md-6 col-lg-4 mt-4"><div class="card">
        <div class="card-body">
          <h4 class="card-title modelName"></h4>
          <div class="model-info mb-2 d-none">
            <a class="btn btn-sample btn-outline-light text-dark border pt-1 pb-1 mt-2">View Sample Data</a>
            </div>
            <div>
            <a class="btn btn-schema btn-outline-light text-dark border pt-1 pb-1 mt-2">View Schema Fields</a>
          </div>
          <div>
            <a class="btn btn-upload btn-outline-primary pt-1 pb-1 mt-2">Upload CSV Data</a>
          </div>
        </div>
      </div></div>`)
      models.map(model => {
        const $item = $itemTemplate.clone()
        $item.find('.modelName').html(model)
        $item.find('a.btn-schema').attr({
          'href': '/api/modelTarget/' + model,
          'target': '_blank'
        }).html()
        $item.find('a.btn-sample').attr({
          'href': '/api/modelTarget/' + model + '/sample?table=1',
          'target': '_blank'
        }).html()
        $item.find('a.btn-upload').attr({
          'href': '/' + model.toLowerCase(),
          // 'target': '_blank'
        }).html()
        $('#modelList').append($item)

        fetch('/api/modelTarget/' + model + '/count')
          .then(resp => resp.json())
          .then(data => {
            if(data && parseInt(data)>=0) {
              $item.find('.model-info')
                .removeClass('d-none')
                .prepend('<div class="mt-2 mb-2">Found '+data+' record(s).</div>')
            }
          })
          .catch(err => console.log('ERROR get count from model=' + model + ':', err))

      })
    }
  } catch (error) {
    handleErrorException(error)
  }

}

$(init)