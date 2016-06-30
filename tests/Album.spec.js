import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate, SimulateNative } from 'react-addons-test-utils';
import Album, { Photo } from '../src';
import AlbumDemo from '../demo/AlbumDemo';

describe('Album', () => {

  let instance = TestUtils.renderIntoDocument(<AlbumDemo />);
  let albumInstance = TestUtils.findRenderedComponentWithType(instance, Album);

  it('the component should be rendered in the target container', (done) => {
    expect(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'kuma-uxcore-album')).to.have.length(1);
    done();
  });

  it('click the cover, switch to fullscreen mode', (done) => {
    Simulate.click(TestUtils.findRenderedDOMComponentWithClass(instance, 'album-cover'));
    expect(albumInstance.state.open).to.be(true);
    done();
  });

  it('keyboard event work fine when enableKeyBoardControl enabled', (done) => {
    Simulate.keyUp(TestUtils.findRenderedDOMComponentWithClass(instance, 'kuma-uxcore-album'), { key: 'Right', keyCode: 39, which: 39 });
    expect(albumInstance.state.current).to.be(1);
    done();
  });
});