export type Obj<T> = { [k: string]: T }

export interface WindowHandler {
  interval: number
}

export type ResponseMessage = `success`
export type Gender = `F` | `M` | `U`
export type TokenType = `bearer`

export interface Profile {
  message: ResponseMessage
  response?: {
    age?: string
    birthday?: string
    email?: string
    id: string
    gender?: Gender
    name?: string
    nickname?: string
    profile_image?: string
  }
  resultcode: string
}

export interface Login {
  access_token: string
  expires_in: string
  state: string
  token_type: TokenType
}
