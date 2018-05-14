export const parseParams = function (paramString) {
  const params = {}
  const regex = /([^#?&=]+)=([^&]*)/g;
  let match = null
  while ((match = regex.exec(paramString)) !== null) {
    const key = decodeURIComponent(match[1])
    const value = decodeURIComponent(match[2])
    params[key] = value
  }
  return params
}

export const parameterize = function (params) {
  return Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')
}