import jsonp from 'jsonp'
import { uriParams, windowCloserListener } from './util'
import { Login, Profile } from '../src/types'

class NaverAuth {
  private accessToken = ``

  async login (clientId: string, callbackUrl: string): Promise<Login> {
    if (!clientId) return Promise.reject({ code: `invalid-client-id`, message: `Invalid client id: "${clientId}"` })
    if (!callbackUrl) return Promise.reject({ code: `invalid-callback-url`, message: `Invalid callback url: "${callbackUrl}"`})
    const baseURL = `https://nid.naver.com/oauth2.0/authorize`
    const responseType = `token`
    const state = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, c => {
      const r = Math.random()*16|0
      const v = c === `x` ? r : (r&0x3|0x8)
      return v.toString(16) 
    })
    const params = {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: callbackUrl,
      state
    }
    const paramString = uriParams.stringify(params)
    const url = `${baseURL}?${paramString}`
    const width = 460
    const height = 629
    const top = window.screen.height/2 - height/2
    const left = window.screen.width/2 - width/2
    const popupWindow = window.open(url, `naverloginpop`, `titlebar=1, resizable=1, scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`)
    if (!popupWindow) return Promise.reject({ code: `popup-error`, message: `Popup could not be opened` })
    const windowHandler = { interval: 0 }
    const windowCloserPromise = windowCloserListener(popupWindow, windowHandler)
    const tokenHandlerPromise = new Promise<any>(resolve => {
      function receiveMessage (event: MessageEvent): any {
        if (event.source !== popupWindow) return
        if (event.origin !== window.location.origin) return
        clearInterval(windowHandler.interval)
        window.removeEventListener(`message`, receiveMessage, false)
        resolve(event.data)
      }
      window.addEventListener(`message`, receiveMessage, false)
    })
    const resp = await Promise.race([ windowCloserPromise, tokenHandlerPromise ]) as Login
    this.accessToken = resp.access_token
    return resp
  }

  handleTokenResponse (): void {
    const params = uriParams.parse(window.location.hash)
    window.opener.postMessage(params, window.location.origin)
    window.close()
  }

  getProfile (accessToken: string = this.accessToken): Promise<Profile> {
    if (!accessToken) return Promise.reject({ code: `invalid-token`, message: `Invalid access token: "${accessToken}". login() to retreive a new access token.` })
    const baseURL = `https://openapi.naver.com/v1/nid/getUserProfile.json`
    const responseType = `json`
    const url = baseURL
    const params = {
      access_token: accessToken,
      response_type: responseType,
      oauth_callback: `callback`
    }
    const options = { param: uriParams.stringify(params) }
    return new Promise<Profile>((resolve, reject) => jsonp(url, options, (error: Error | null, data: Profile) => {
      if (error) reject(error)
      resolve(data)
    }))
  }
}

export default new NaverAuth()
