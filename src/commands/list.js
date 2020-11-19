const { getKong } = require('../kong')
const { logTable } = require('../helper')
const { repeat } = require('ramda')

function pad (value, n) {
  return `${repeat(' ', n - value.length).join('')}${value}`
}

function listApis (options) {
  return getKong('/apis')
    .then(response => {
      const apiList = response.data
        .map(api => ({
          name: api.name,
          hosts: api.hosts,
          preserve_host: pad(api.preserve_host.toString(), 13),
          strip_uri: pad(api.strip_uri.toString(), 9),
          upstream_url: api.upstream_url,
          uris: api.uris.join(', ')
        }))
      if (!options.silent) {
        logTable(apiList)
      }

      return apiList
    })
    .catch(() => {
      if (!options.silent) {
        console.log('Failed, check if Kong running first')
      }

      return null
    })
}

module.exports = {
  listApis,
  list: program => {
    program
      .command('list')
      .option('--silent', 'No console output')
      .description('List APIs')
      .action(listApis)
  }
}
