import { Obj, WindowHandler } from '../src/types'

export const uriParams = {
  parse (paramString: string): Obj<string> {
    const params: Obj<string> = {}
    const regex = /([^#?&=]+)=([^&]*)/g;
    let match = null
    while ((match = regex.exec(paramString)) !== null) {
      const key = decodeURIComponent(match[1])
      const value = decodeURIComponent(match[2])
      params[key] = value
    }
    return params
  },
  stringify (params: object): string {
    return Object
      .entries(params)
      .map(([ key, val ]) => key + `=` + encodeURIComponent(val))
      .join(`&`)
  }
}

export const windowCloserListener = (popupWindow: Window, windowHandler: WindowHandler): Promise<void> => {
  return new Promise((resolve, reject) => {
    windowHandler.interval = setInterval(() => {
      if (!popupWindow.closed) return
      setTimeout(() => {
        clearInterval(windowHandler.interval)
        return reject({ code: `popup-closed`, message: `The popup has been closed by the user before finalizing the operation` })
      }, 100)
    }, 100)
  })
}