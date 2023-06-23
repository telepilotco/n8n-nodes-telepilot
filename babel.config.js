module.exports = {
  'presets': [
    ['@babel/env', {
      'targets': {
        'node': '16.20.0'
      }
    }],
    '@babel/preset-flow'
  ],
  'plugins': [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ]
}
