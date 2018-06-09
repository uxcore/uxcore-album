import expect from 'expect.js';
import React from 'react';
import Icon from 'uxcore-icon';
import assign from 'object-assign';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
// import TestUtils, { Simulate, SimulateNative } from 'react-addons-test-utils';
import Album, { Photo } from '../src';
// import AlbumDemo from '../demo/AlbumDemo';

Enzyme.configure({ adapter: new Adapter() });

function renderAlbumWithProps(props) {
  const renderProps = assign({
    width: 400,
    height: 200,
    enableKeyBoardControl: true,
    enableThumbs: true,
    thumbPlacement: 'bottom',
    thumbBackground: '#000',
  }, props);
  const wrapper = mount(
    <Album {...renderProps}>
      <Photo
        src="//img.alicdn.com/imgextra/i2/927018118/TB13fBjKFXXXXbPXpXXXXXXXXXX_!!0-tstar.jpg"
        key={0}
      />
      <Photo src="https://img.alicdn.com/tps/i4/TB1bokgFVXXXXbKXFXXYCct.pXX-238-238.png" key={1} />
      <Photo
        src="//img.alicdn.com/imgextra/i4/927018118/TB1N0hqKFXXXXXDXXXXXXXXXXXX_!!0-tstar.jpg"
        key={2}
      />
      <Photo src="https://img.alicdn.com/imgextra/i2/290551947/TB1C799LFXXXXaiXpXXXXXXXXXX_!!0-tstar.jpg" key={3} />
      <Photo src="https://img.alicdn.com/imgextra/i1/290551947/TB1p81JLFXXXXXXaXXXXXXXXXXX_!!0-tstar.jpg" key={4} />
      <Photo src="https://img.alicdn.com/imgextra/i2/290551947/TB1W.ZrLpXXXXbMXpXXXXXXXXXX_!!0-tstar.jpg" key={5} />
      <Photo src="https://img.alicdn.com/imgextra/i1/673400424/TB1Jze1KXXXXXcfXFXXXXXXXXXX_!!673400424-0-tstar.jpg" key={6} />
      <Photo src="https://img.alicdn.com/imgextra/i4/673400424/TB1d2PkKXXXXXbiXXXXXXXXXXXX_!!673400424-0-tstar.jpg" key={7} />
    </Album>
  );
  return wrapper;
}

describe('Album', () => {

  describe('render', () => {
    it('should render correctly', (done) => {
      const wrapper = renderAlbumWithProps();
      expect(wrapper.find('.kuma-uxcore-album').length).to.be(1);
      done();
    });

    it('should render correctly with different enableThumbs and enableThumbs', (done) => {
      const wrapper1 = renderAlbumWithProps({
        enableThumbs: false,
      });
      expect(wrapper1.find('.thumbs-preview').length).to.be(0);
      const wrapper2 = renderAlbumWithProps({
        enableThumbs: true,
        thumbPlacement: 'right',
      });
      expect(wrapper2.find('.thumb-placement-right').length).to.be(1);
      wrapper2.instance().setCurrent(2);
      done();
    });

    describe('showButton prop', () => {
      it('should render correctly when showButton is true', () => {
        const wrapper = renderAlbumWithProps({
          showButton: true,
        });
        expect(wrapper.find('.album-func-button-item').length).to.be(2);
      });

      it('should render correctly when showButton is false', () => {
        const wrapper = renderAlbumWithProps({
          showButton: false,
        });
        expect(wrapper.find('.album-func-button-item').length).to.be(0);
      });
    });

    describe('customButtons prop', () => {
      it('should accept an object', () => {
        const wrapper = renderAlbumWithProps({
          showButton: true,
          customButtons: {
            icon: <Icon name="xiazai" />,
            onClick: () => {}
          },
        });
        expect(wrapper.find('.album-func-button-item').length).to.be(3);
      });

      it('should accept an array', () => {
        const wrapper = renderAlbumWithProps({
          showButton: true,
          customButtons: [
            {
              icon: <Icon name="xiazai" />,
              onClick: () => {},
            },
            {
              icon: <Icon name="dayin" />,
              onClick: () => {},
            },
          ]
        });
        expect(wrapper.find('.album-func-button-item').length).to.be(4);
      });

      it('should call the onClick handler when clicked', () => {
        const spy = sinon.spy();
        const wrapper = renderAlbumWithProps({
          showButton: true,
          customButtons: {
            icon: <Icon name="xiazai" />,
            onClick: spy,
          },
        });
        wrapper.find('.album-func-button-item').at(1).simulate('click');
        expect(spy.calledOnce).to.be(true);
      });
    });
  });

  describe('control', () => {
    const wrapper = renderAlbumWithProps();
    it('should nav correctly with mouseevent in normal mode', (done) => {
      wrapper.find('.album-carousel-container li').at(2).simulate('click');
      expect(wrapper.instance().state.current).to.be(2);
      wrapper.find('.album-carousel .control-down').simulate('click');
      expect(wrapper.instance().state.current).to.be(3);
      done();
    });
    it('should enter the fullscreen mode when clicked on the cover', (done) => {
      wrapper.find('.album-cover').simulate('click');
      expect(wrapper.instance().state.open).to.be(true);
      done();
    });
    it('should nav correctly with mouseevent in fullscreen mode', (done) => {
      wrapper.find('.album-overlay .album-carousel-list li').last().simulate('click');
      wrapper.find('.album-next').simulate('click');
      expect(wrapper.instance().viewer.state.current).to.be(4);
      wrapper.find('.album-prev').simulate('click');
      expect(wrapper.instance().viewer.state.current).to.be(3);
      wrapper.find('.album-next').simulate('click');
      expect(wrapper.instance().viewer.state.current).to.be(4);
      done();
    });
    it('should nav correctly with keyboard event in fullscreen mode', (done) => {
      wrapper.find('.album-overlay').simulate('keyup', {
        keyCode: 37,
      });
      expect(wrapper.instance().viewer.state.current).to.be(3);
      wrapper.find('.album-overlay').simulate('keyup', {
        keyCode: 39,
      });
      expect(wrapper.instance().viewer.state.current).to.be(4);
      wrapper.find('.album-overlay').simulate('keyup', {
        keyCode: 27,
      });
      expect(wrapper.instance().state.open).to.be(false);
      done();
    });
    it('should exit to default mode when clicked the close icon', (done) => {
      wrapper.find('.album-cover').simulate('click');
      expect(wrapper.instance().state.open).to.be(true);
      wrapper.find('.album-close').simulate('click');
      expect(wrapper.instance().state.open).to.be(false);
      done();
    });
  });

  describe('api', () => {
    it('should open the album cover with calling api:Album.show', (done) => {
      const container = mount(<div></div>);
      Album.show({
        photos: [
          <Photo
            src="//img.alicdn.com/imgextra/i2/927018118/TB13fBjKFXXXXbPXpXXXXXXXXXX_!!0-tstar.jpg"
            key={0}
          />,
          <Photo src="https://img.alicdn.com/tps/i4/TB1bokgFVXXXXbKXFXXYCct.pXX-238-238.png" key={1} />,
          <Photo
            src="//img.alicdn.com/imgextra/i4/927018118/TB1N0hqKFXXXXXDXXXXXXXXXXXX_!!0-tstar.jpg"
            key={2}
          />,
        ],
        getContainer() {
          return container.instance();
        }
      });
      expect(container.instance().children.length).to.be(1);
      done()
    });
    it('should work with config.src', (done) => {
      const container = mount(<div></div>);
      Album.show({
        src: '//img.alicdn.com/imgextra/i2/927018118/TB13fBjKFXXXXbPXpXXXXXXXXXX_!!0-tstar.jpg',
        getContainer() {
          return container.instance();
        },
      });
      expect(container.instance().children.length).to.be(1);
      done();
    });
  });
});