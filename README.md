## uxcore-album

React album

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url] 
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-album.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-album
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-album.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-album
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-album.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-album?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-album.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-album
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-album.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-album#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-album.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-album.svg
[sauce-url]: https://saucelabs.com/u/uxcore-album


### Development

```sh
git clone https://github.com/uxcore/uxcore-album
cd uxcore-album
npm install
npm run server
```

if you'd like to save your install time，you can use uxcore-tools globally.

```sh
npm install uxcore-tools -g
git clone https://github.com/uxcore/uxcore-album
cd uxcore-album
npm install
npm run dep
npm run start
```

### Test Case

```sh
npm run test
```

### Coverage

```sh
npm run coverage
```

## Demo

http://uxcore.github.io/components/album

## Contribute

Yes please! See the [CONTRIBUTING](https://github.com/uxcore/uxcore/blob/master/CONTRIBUTING.md) for details.

## API

### Album.Props

| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
| width | number or string | no | '' | the default image cover's width |
| height | number or string | no | '' | the default image cover's height |
| enableKeyBoardControl | boolean | no | true | whether the album can be controlled by the keyboard navigation |
| enableThumbs | boolean | no | false | whether the show thumbnail list|
| thumbPlacement | string | no | right | the placement of thumbnail, you can set 'top'/'right'/'bottom'/'left'/ |
| thumbBackground | string | no | #000 | if the image couldn't cover the gird, give it a background|
| showButton | boolean | no | true | show the function button |

### Photo.Props

| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
| src | string | yes | '' | same as img's src |
| thumb-src | string | no | '' | set thumbnail image source if 'enableThumbs' is true |

## Method

### Album.show(config)

 With this method, the component can be used by calling `Album.show({src: 'foo/url'})` or `Album.show({photos: [<Photo src="#url1" />, <Photo src="#url2" />]})` directly.

#### config

| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
| src | string | false | null | the image src |
| photos | array of `Photo` | false | [] | array of Photo element |
| getContainer | function | false | the function will append a new div to document body. | define the container which album rendered into |
