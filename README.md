# Prerequisites
1. Register application at https://developers.naver.com/apps/#/register
2. Select the "네아로 (네이버 아이디로 로그인)" API
3. Store the "Client ID"

# Installation
```
$ npm install naver-id-login
```

# Usage
## Initialization
```typescript
import naver from 'naver-id-login'
```
## Login
A new popup window opens where the user is promted to type in their `username` and `password`
### **login(clientId: string, callbackUrl: string): Promise\<Login\>**
```typescript
const clientId = process.env.NAVER_CLIENT_ID
const callbackUrl = 'http://localhost:8080/callback/naver'
const auth = await naver.login(clientId, callbackUrl)
```
### **Login response object**
```typescript
{
  access_token: string
  expires_in: string // e.g. "3600"
  state: string
  token_type: string // "bearer"
}
```
### **Login window close error object**
```typescript
{
  code: string // "popup-closed"
  message: string // "The popup has been closed by the user before finalizing the operation"
}
```

## Handling callback
In local route `/callback/naver` (the chosen `callbackUrl` during `login()`)
### **handleTokenResponse(): void**
```typescript
naver.handleTokenResponse()
```

## Get Profile
### **getProfile(accessToken?: string): Promise\<Profile\>**
If `naver.login()` has successfully been called, the `accessToken` is stored and **the `accessToken` can be omitted**.
```typescript
const profile = await naver.getProfile()
```
However, if you want to get profiles from different logged in users you can override the stored `accessToken`.
```typescript
const profile1 = await naver.getProfile(ACCESS_TOKEN1)
const profile2 = await naver.getProfile(ACCESS_TOKEN2)
```

### **Profile response object**
```typescript
{
  message: string // e.g. "success"
  response?: {
    age?: string // e.g. "30-39"
    birthday?: string // e.g. "12-24"
    email?: string
    id: string
    gender?: 'F' | 'M' | 'U'
    name?: string
    nickname?: string
    profile_image?: string
  }
  resultcode: string // e.g. "00"
}
```
