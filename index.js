import axios from 'axios'
import util from 'util'

export const NaverAuth = function () {
  const TRUESTED_URL = 'SOMEURL'

  this.login = function (clientId, callbackURL) {
    if (!clientId || !callbackURL) {
      console.error(`invalid client id and/or callback url "${clientId}", "${callbackURL}"`)
      return
    }

    const baseURL = 'https://nid.naver.com/oauth2.0/authorize'
    const responseType = 'token'
    const state = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8)
      return v.toString(16) 
    })
    const params = {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: encodeURIComponent(callbackURL),
      state
    }
    const paramString = util.parameterize(params)
    const url = `${baseURL}?${paramString}`

    const popupWindow = window.open(url, 'naverloginpop', 'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550')

    return new Promise(resolve => {
      function receiveMessage (event) {
        if (event.source !== popupWindow) {
          return
        }
        if (event.origin !== 'TRUESTED_URL') {
          return
        }
        window.removeEventListener('message', receiveMessage, false)
        const tokenData = event.data
        resolve(tokenData)
      }
      window.addEventListener('message', receiveMessage, false)
    })
  }

  this.handleTokenResponse = function () {
    const params = util.parseParams(window.location.hash)
    window.opener.postMessage(params, TRUESTED_URL)
    window.close()
  }

  this.getProfile = function (token) {
    if (!token) {
      console.error(`invalid token: "${token}"`)
      return
    }
    const baseURL = 'https://openapi.naver.com/v1/nid/getUserProfile.json'
    const responseType = 'json'
    
    const url = `${baseURL}`
    const params = {
      access_token: token,
      response_type: responseType
    }
    return axios.get(url, { params }).then(resp => {
      const user = resp.data.response
      return user
    })
  }
}