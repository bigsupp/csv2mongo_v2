const init = () => {
  $('#paneUpload button[name="btnUpload"]').on('click', async () => {
    const inputFiles = $('#paneUpload input[name="userAttachment"]').prop('files')
    if (!inputFiles || !inputFiles[0]) return;
    const formData = new FormData();
    formData.append("userAttachment", inputFiles[0])
    try {
      const uploaded = await API.post('/attachment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (!uploaded || !uploaded.data || !uploaded.data._id) {
        throw new Error('attachment upload failed')
      }
      $('#paneSample button[name="btnLoadData"]').attr({
        'data-attachment-id': uploaded.data._id
      })
      const samples = await API.get(`/attachment/${uploaded.data._id}/sample/10`)
      if (!samples || !samples.data) {
        throw new Error('sample data from attachment is invalid/error')
      }
      updateTableSample((samples.data && samples.data.sample) ? samples.data.sample : [])
      $('#textTotalRows').html(`Total ${samples.data.rows} row(s)`)
      $('#paneUpload').addClass('d-none')
      $('#paneSample').removeClass('d-none')
    } catch (error) {
      handleErrorException(error)
    }
  })

  $('#paneSample button[name="btnLoadData"]').on('click', async function () {
    const attachment_id = $(this).data('attachment-id');
    const confirmText = $(`#refCode`).val()
    const enteredConfirm = prompt(`Please enter "${confirmText}" into following input as confirmation before continues.`)
    if(!enteredConfirm || enteredConfirm.length===0) {
      return
    }
    if(enteredConfirm !== confirmText) {
      alert('Confirmation text is invalid.')
      return
    }
    $('#paneSample').addClass('d-none')
    $('#paneResult').removeClass('d-none')
    const ref_code = $('#refCode').val()
    try {
      if (!ref_code || ref_code.replace(/\s/g, "").length <= 0) {
        throw new Error('refCode is empty and/or invalid')
      }
      const deleted = await API.delete(`/replacer/${target_model}/all`, {
        data: {
          ref_code
        }
      })
      console.log('deleted: ', deleted);
      if (deleted && deleted.data) {
        $('#dumpResult').append(
          $('<li>').html(`Deleted ${deleted.data.deletedCount} record(s) with model=${target_model} ref_code=${ref_code}.`)
        )
      }
      const inserted = await API.put(`/attachment/${attachment_id}/dump`, {
        ref_code,
        target: target_model
      })
      console.log('inserted: ', inserted);
      if (inserted && inserted.data) {
        $('#dumpResult').append(
          $('<li>').html(`Inserted ${inserted.data.insertedCount} record(s) with model=${target_model} ref_code=${ref_code}.`)
        )
      }
      $('#waiting .spinner').remove()
      $('#waiting .form-group').removeClass('d-none')
    } catch (error) {
      handleErrorException(error)
    }
  })

  $('#paneUpload').removeClass('d-none')
  $('#refCode').val(
    (target_model && target_model.length > 0) ? target_model.toLowerCase() : $('#refCode').val()
  )

}

$(init)

function updateDumpResult(result) {
  const {
    removeCount,
    doneResults,
    failResults
  } = result
  let text = `<p>Removed=${removeCount}</p>
    <p>Success=${doneResults.length}, Failed=${failResults.length}</p>`
  $('#dumpResult').empty()
  $('#dumpResult').append($('<p>').html(text))
  if (failResults.length > 0) {
    const $failList = $('<ul>')
    failResults.map(item => {
      $failList.append($('<li>').html(`${item.telephoneNumber} ${item.firstName} ${item.lastName}`))
    })
    $('#dumpResult').append(
      $('<strong>').html('Failed:'),
      $failList
    )
  }
}

function updateTableSample(rows) {
  const $table = $('#paneSample table')
  const $thead = $table.find('thead')
  const $tbodySample = $table.find('tbody.sampleData')
  let headers = []
  if (rows && rows.length > 0) {
    headers = Object.keys(rows[0])
    $thead.html(`<tr>
      <th>${headers.join('</th><th>')}</th>
    </tr>`)
  }
  $tbodySample.empty()
  rows.map(row => {
    const $tr = $('<tr>')
    headers.map(header => {
      $tr.append($('<td>').html(row[header]))
    })
    $tbodySample.append($tr)
  })
}