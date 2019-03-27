const $ = require('./jquery-only-ajax')
const util = require('./util')

export default function () {
  this.login = async function (clientId, callbackURL) {
    if (!clientId) return Promise.reject({ code: 'invalid-client-id', message: `Invalid client id: '${clientId}'` })
    if (!callbackURL) return Promise.reject({ code: 'invalid-callback-url', message: `Invalid callback url: '${callbackURL}'`})

    const baseURL = 'https://nid.naver.com/oauth2.0/authorize'
    const responseType = 'token'
    const state = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0
      const v = c === 'x' ? r : (r&0x3|0x8)
      return v.toString(16) 
    })
    const params = {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: callbackURL,
      state
    }
    const paramString = util.parameterize(params)
    const url = `${baseURL}?${paramString}`

    const width = 460
    const height = 629
    const top = window.screen.height/2 - height/2
    const left = window.screen.width/2 - width/2

    const popupWindow = window.open(url, 'naverloginpop', `titlebar=1, resizable=1, scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`)

    const windowHandler = { interval: null }
    const windowCloserPromise = util.windowCloserListener(popupWindow, windowHandler)

    const tokenHandlerPromise = new Promise(resolve => {
      function receiveMessage (event) {
        if (event.source !== popupWindow) return
        if (event.origin !== window.location.origin) return
        clearInterval(windowHandler.interval)
        window.removeEventListener('message', receiveMessage, false)
        resolve(event.data)
      }
      window.addEventListener('message', receiveMessage, false)
    })

    return Promise.race([windowCloserPromise, tokenHandlerPromise])
  }

  this.handleTokenResponse = function () {
    const params = util.parseParams(window.location.hash)
    window.opener.postMessage(params, window.location.origin)
    window.close()
  }

  this.getProfile = function (accessToken) {
    if (!accessToken) return Promise.reject({ code: 'invalid-token', message: `Invalid access token: '${accessToken}'. login() to retreive a new access token.` })

    const baseURL = 'https://openapi.naver.com/v1/nid/getUserProfile.json'
    const responseType = 'json'
    const url = baseURL
    const params = {
      access_token: accessToken,
      response_type: responseType
    }
    
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: 'GET',
        data: params,
        dataType: 'jsonp',
        jsonp: 'oauth_callback',
        success: resolve,
        error: reject
      })
    })
  }
}