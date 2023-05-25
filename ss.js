const sss = {
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: [Function: httpAdapter
    ],
    transformRequest: [
      [Function: transformRequest
      ]
    ],
    transformResponse: [
      [Function: transformResponse
      ]
    ],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: [Function: validateStatus
    ],
    headers: {
      Accept: 'application/json, text/plain, * /*',
      'Content-Type': 'application/json',
      'User-Agent': 'OpenAI/NodeJS/3.2.1',
      Authorization: 'Bearer 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',
      'Content-Length': 188
    },
    method: 'post',
    data: '{"model":"gpt-3.5-turbo-0301","temperature":0.7,"max_tokens":5,"messages":[{"role":"assistant","content":"Translate the following English text to French"},{"role":"user","content":"two"}]}',
    url: 'https://api.openai.com/v1/chat/completions'
  },
  request: <ref * 1 > ClientRequest {
    _events: [Object: null prototype] {
      abort: [Function (anonymous)],
aborted: [Function(anonymous)],
  connect: [Function(anonymous)],
    error: [Function(anonymous)],
      socket: [Function(anonymous)],
        timeout: [Function(anonymous)],
          finish: [Function: requestOnFinish]
    },
_eventsCount: 7,
  _maxListeners: undefined,
    outputData: [],
      outputSize: 0,
        writable: true,
          destroyed: true,
            _last: false,
              chunkedEncoding: false,
                shouldKeepAlive: true,
                  maxRequestsOnConnectionReached: false,
                    _defaultKeepAlive: true,
                      useChunkedEncodingByDefault: true,
                        sendDate: false,
                          _removedConnection: false,
                            _removedContLen: false,
                              _removedTE: false,
                                strictContentLength: false,
                                  _contentLength: 188,
                                    _hasBody: true,
                                      _trailer: '',
                                        finished: true,
                                          _headerSent: true,
                                            _closed: true,
                                              socket: TLSSocket {
  _tlsOptions: [Object],
    _secureEstablished: true,
      _securePending: false,
        _newSessionPending: false,
          _controlReleased: true,
            secureConnecting: false,
              _SNICallback: null,
                servername: 'api.openai.com',
                  alpnProtocol: false,
                    authorized: true,
                      authorizationError: null,
                        encrypted: true,
                          _events: [Object: null prototype],
                            _eventsCount: 9,
                              connecting: false,
                                _hadError: false,
                                  _parent: null,
                                    _host: 'api.openai.com',
                                      _closeAfterHandlingError: false,
                                        _readableState: [ReadableState],
                                          _maxListeners: undefined,
                                            _writableState: [WritableState],
                                              allowHalfOpen: false,
                                                _sockname: null,
                                                  _pendingData: null,
                                                    _pendingEncoding: '',
                                                      server: undefined,
                                                        _server: null,
                                                          ssl: [TLSWrap],
                                                            _requestCert: true,
                                                              _rejectUnauthorized: true,
                                                                timeout: 5000,
                                                                  parser: null,
                                                                    _httpMessage: null,
                                                                      [Symbol(res)]: [TLSWrap],
                                                                        [Symbol(verified)]: true,
                                                                          [Symbol(pendingSession)]: null,
                                                                            [Symbol(async_id_symbol)]: -1,
                                                                              [Symbol(kHandle)]: [TLSWrap],
                                                                                [Symbol(lastWriteQueueSize)]: 0,
                                                                                  [Symbol(timeout)]: Timeout {
    _idleTimeout: 5000,
      _idlePrev: [TimersList],
        _idleNext: [TimersList],
          _idleStart: 31374,
            _onTimeout: [Function: bound],
              _timerArgs: undefined,
                _repeat: null,
                  _destroyed: false,
                    [Symbol(refed)]: false,
                      [Symbol(kHasPrimitive)]: false,
                        [Symbol(asyncId)]: 118,
                          [Symbol(triggerId)]: 116
  },
  [Symbol(kBuffer)]: null,
    [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
        [Symbol(kCapture)]: false,
          [Symbol(kSetNoDelay)]: false,
            [Symbol(kSetKeepAlive)]: true,
              [Symbol(kSetKeepAliveInitialDelay)]: 1,
                [Symbol(kBytesRead)]: 0,
                  [Symbol(kBytesWritten)]: 0,
                    [Symbol(connect - options)]: [Object]
},
_header: 'POST /v1/chat/completions HTTP/1.1\r\n' +
  'Accept: application/json, text/plain, */*\r\n' +
  'Content-Type: application/json\r\n' +
  'User-Agent: OpenAI/NodeJS/3.2.1\r\n' +
  'Authorization: Bearer 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\r\n' +
  'Content-Length: 188\r\n' +
  'Host: api.openai.com\r\n' +
  'Connection: keep-alive\r\n' +
  '\r\n',
  _keepAliveTimeout: 0,
    _onPendingData: [Function: nop
    ],
      agent: Agent {
  _events: [Object: null prototype
  ],
    _eventsCount: 2,
      _maxListeners: undefined,
        defaultPort: 443,
          protocol: 'https:',
            options: [Object: null prototype
            ],
              requests: [Object: null prototype
              ] { },
  sockets: [Object: null prototype
  ] { },
  freeSockets: [Object: null prototype
  ],
    keepAliveMsecs: 1000,
      keepAlive: true,
        maxSockets: Infinity,
          maxFreeSockets: 256,
            scheduling: 'lifo',
              maxTotalSockets: Infinity,
                totalSocketCount: 1,
                  maxCachedSessions: 100,
                    _sessionCache: [Object
                    ],
                      [Symbol(kCapture)
                      ]: false
},
socketPath: undefined,
  method: 'POST',
    maxHeaderSize: undefined,
      insecureHTTPParser: undefined,
        path: '/v1/chat/completions',
          _ended: true,
            res: IncomingMessage {
  _readableState: [ReadableState
  ],
    _events: [Object: null prototype
    ],
      _eventsCount: 4,
        _maxListeners: undefined,
          socket: null,
            httpVersionMajor: 1,
              httpVersionMinor: 1,
                httpVersion: '1.1',
                  complete: true,
                    rawHeaders: [Array
                    ],
                      rawTrailers: [],
                        aborted: false,
                          upgrade: false,
                            url: '',
                              method: null,
                                statusCode: 429,
                                  statusMessage: 'Too Many Requests',
                                    client: [TLSSocket
                                    ],
                                      _consuming: false,
                                        _dumped: false,
                                          req: [Circular * 1
                                          ],
                                            responseUrl: 'https: //api.openai.com/v1/chat/completions',
                                              redirects: [],
                                                [Symbol(kCapture)
                                                ]: false,
                                                  [Symbol(kHeaders)
                                                  ]: [Object
                                                  ],
                                                    [Symbol(kHeadersCount)
                                                    ]: 42,
                                                      [Symbol(kTrailers)
                                                      ]: null,
                                                        [Symbol(kTrailersCount)
                                                        ]: 0
},
aborted: false,
  timeoutCb: null,
    upgradeOrConnect: false,
      parser: null,
        maxHeadersCount: null,
          reusedSocket: false,
            host: 'api.openai.com',
              protocol: 'https:',
                _redirectable: Writable {
  _writableState: [WritableState
  ],
    _events: [Object: null prototype
    ],
      _eventsCount: 3,
        _maxListeners: undefined,
          _options: [Object
          ],
            _ended: true,
              _ending: true,
                _redirectCount: 0,
                  _redirects: [],
                    _requestBodyLength: 188,
                      _requestBodyBuffers: [],
                        _onNativeResponse: [Function(anonymous)
                        ],
                          _currentRequest: [Circular * 1
                          ],
                            _currentUrl: 'https: //api.openai.com/v1/chat/completions',
                              [Symbol(kCapture)
                              ]: false
},
[Symbol(kCapture)
]: false,
  [Symbol(kBytesWritten)
  ]: 0,
    [Symbol(kEndCalled)
    ]: true,
      [Symbol(kNeedDrain)
      ]: false,
        [Symbol(corked)
        ]: 0,
          [Symbol(kOutHeaders)
          ]: [Object: null prototype
          ] {
  accept: [Array
  ],
    'content-type': [Array
    ],
      'user-agent': [Array
      ],
        authorization: [Array
        ],
          'content-length': [Array
          ],
            host: [Array
            ]
},
[Symbol(kUniqueHeaders)
]: null
        },
response: {
  status: 429,
    statusText: 'Too Many Requests',
      headers: {
    date: 'Thu,
    25 May 2023 10: 53: 23 GMT',
    'content-type': 'application/json',
      'content-length': '349',
        connection: 'keep-alive',
          'access-control-allow-origin': '*',
            'openai-model': 'gpt-3.5-turbo-0301',
              'openai-organization': 'maila-ai',
                'openai-processing-ms': '30017',
                  'openai-version': '2020-10-01',
                    'strict-transport-security': 'max-age=15724800; includeSubDomains',
                      'x-ratelimit-limit-requests': '3500',
                        'x-ratelimit-limit-tokens': '90000',
                          'x-ratelimit-remaining-requests': '3499',
                            'x-ratelimit-remaining-tokens': '89980',
                              'x-ratelimit-reset-requests': '17ms',
                                'x-ratelimit-reset-tokens': '13ms',
                                  'x-request-id': 'e4480d8f457567b234d29e65c308efa2',
                                    'cf-cache-status': 'DYNAMIC',
                                      server: 'cloudflare',
                                        'cf-ray': '7ccd3b43e831b52d-OSL',
                                          'alt-svc': 'h3=":443"; ma=86400'
  },
  config: {
    transitional: [Object
    ],
      adapter: [Function: httpAdapter
      ],
        transformRequest: [Array
        ],
          transformResponse: [Array
          ],
            timeout: 0,
              xsrfCookieName: 'XSRF-TOKEN',
                xsrfHeaderName: 'X-XSRF-TOKEN',
                  maxContentLength: -1,
                    maxBodyLength: -1,
                      validateStatus: [Function: validateStatus
                      ],
                        headers: [Object
                        ],
                          method: 'post',
                            data: '{
    "model": "gpt-3.5-turbo-0301",
      "temperature": 0.7,
        "max_tokens": 5,
          "messages": [
            {
              "role": "assistant",
              "content": "Translate the following English text to French"
            },
            {
              "role": "user",
              "content": "two"
            }
          ]
  } ',
  url: 'https: //api.openai.com/v1/chat/completions'
},
request: <ref * 1 > ClientRequest {
  _events: [Object: null prototype
  ],
    _eventsCount: 7,
      _maxListeners: undefined,
        outputData: [],
          outputSize: 0,
            writable: true,
              destroyed: true,
                _last: false,
                  chunkedEncoding: false,
                    shouldKeepAlive: true,
                      maxRequestsOnConnectionReached: false,
                        _defaultKeepAlive: true,
                          useChunkedEncodingByDefault: true,
                            sendDate: false,
                              _removedConnection: false,
                                _removedContLen: false,
                                  _removedTE: false,
                                    strictContentLength: false,
                                      _contentLength: 188,
                                        _hasBody: true,
                                          _trailer: '',
                                            finished: true,
                                              _headerSent: true,
                                                _closed: true,
                                                  socket: [TLSSocket
                                                  ],
                                                    _header: 'POST /v1/chat/completions HTTP/1.1\r\n' +
                                                      'Accept: application/json, text/plain, */*\r\n' +
                                                      'Content-Type: application/json\r\n' +
                                                      'User-Agent: OpenAI/NodeJS/3.2.1\r\n' +
                                                      'Authorization: Bearer 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\r\n' +
                                                      'Content-Length: 188\r\n' +
                                                      'Host: api.openai.com\r\n' +
                                                      'Connection: keep-alive\r\n' +
                                                      '\r\n',
                                                      _keepAliveTimeout: 0,
                                                        _onPendingData: [Function: nop],
                                                          agent: [Agent],
                                                            socketPath: undefined,
                                                              method: 'POST',
                                                                maxHeaderSize: undefined,
                                                                  insecureHTTPParser: undefined,
                                                                    path: '/v1/chat/completions',
                                                                      _ended: true,
                                                                        res: [IncomingMessage],
                                                                          aborted: false,
                                                                            timeoutCb: null,
                                                                              upgradeOrConnect: false,
                                                                                parser: null,
                                                                                  maxHeadersCount: null,
                                                                                    reusedSocket: false,
                                                                                      host: 'api.openai.com',
                                                                                        protocol: 'https:',
                                                                                          _redirectable: [Writable],
                                                                                            [Symbol(kCapture)]: false,
                                                                                              [Symbol(kBytesWritten)]: 0,
                                                                                                [Symbol(kEndCalled)]: true,
                                                                                                  [Symbol(kNeedDrain)]: false,
                                                                                                    [Symbol(corked)]: 0,
                                                                                                      [Symbol(kOutHeaders)]: [Object: null prototype],
                                                                                                        [Symbol(kUniqueHeaders)]: null
},
data: { error: [Object] }
  }