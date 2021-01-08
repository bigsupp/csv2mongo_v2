const init = async () => {
  try {
    const resp = await API.get('/modeltarget')
    if (resp && resp.data) {
      const models = resp.data      
      console.log('models: ', models);
      models.map(model => {
        const $item = $(`.cardItem[data-modelname="${model}"]`)
        $item.find('.modelName').html(model)
        $item.find('a.btn-schema').attr({
          'href': `${baseURL}/api/modelTarget/${model}`,
          'target': '_blank'
        }).html()
        $item.find('a.btn-sample').attr({
          'href': `${baseURL}/api/modelTarget/${model}/sample?table=1`,
          'target': '_blank'
        }).html()
        $item.find('a.btn-data').attr({
          'href': `${baseURL}/api/modelTarget/${model}/data`,
          'target': '_blank'
        }).html()
        $item.find('a.btn-upload').attr({
          'href': `${baseURL}/${model}`,
        }).html()
        $item.find('a.btn-download').attr({
          'href': `${baseURL}/api/modelTarget/${model}/download`,
        }).html()
        // $item.find('a.btn-download')
        //   .removeClass('btn-outline-warning')
        //   .addClass('text-secondary')
        //   .prop('disabled', true)
      })
    }
  } catch (error) {
    handleErrorException(error)
  }

  $('.tableModelTargetStats .total-item-value').each(function() {
    const self = $(this)
    const valueText = self.data('total')
    const modelName = self.data('modelname')
    const $stat = $(`.cardItem[data-modelname="${modelName}"]`).find('.stat-modelName-total')
    $stat.find('.stat-modelName-total-value').html(valueText)
    $stat.removeClass('d-none')
  })

}

$(init)