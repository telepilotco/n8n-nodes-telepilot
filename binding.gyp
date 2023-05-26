{
    "targets": [{
        "target_name": "bridge",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "td.cpp"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        # 'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'conditions': [
            ['OS=="win"', {
                'sources': [
                    'win32-dlfcn.cpp'
                ]
            }],
            ['OS=="mac"', {
                      'xcode_settings': {
                        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                      }
                    }]
        ]
    }]
}
