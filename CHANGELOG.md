# Changelog

### 2.0.0 

- Rewrote project in typescript
- In addition to `login()` returning the `accessToken`, it is now also stored
- Made `accessToken` paramter optional `getProfile()`, will use the stored `accessToken` if it exists
- Added lightweight `jsonp` dependency
- Removed `jQuery ajax` dependency
