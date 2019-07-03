# ZsDL
Zippyshare direct downloader (private use).

## Install
```
$ git clone https://github.com/mxsgx/zsdl.git
$ cd zsdl
$ npm install
$ npm start
```
Default is running at localhost:3000

## Usage
#### Redirecting (download automatically)
```
GET: /?url=<zippyshare>
```
**Example**: `http://localhost:3000/?url=https://www7.zippyshare.com/v/abcdefg/file.html`
#### JSON
```
GET: /?url=<zippyshare>&no
```
**Example**: `http://localhost:3000/?url=https://www7.zippyshare.com/v/abcdefg/file.html&no`
