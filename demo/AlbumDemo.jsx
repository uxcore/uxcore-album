/**
 * Album Component Demo for uxcore
 * @author vincent.bian
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import Icon from 'uxcore-icon';
import Album, { Photo } from '../src';

/* eslint-disable class-methods-use-this */
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onClickSingle() {
    Album.show({
      src: '//img.alicdn.com/imgextra/i2/927018118/TB13fBjKFXXXXbPXpXXXXXXXXXX_!!0-tstar.jpg',
      showButton: true,
      customButtons: [{
        icon: <Icon name="dayin" />,
        onClick: () => {
          console.log('Print');
        },
      }, {
        icon: <Icon name="dayin" />,
        onClick: () => {
          console.log('Print');
        },
      }],
    });
  }

  onClickMultiple() {
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
      current: 1,
    });
  }

  render() {
    return (
      <div style={{ margin: '100px 0 0 200px' }}>
        <h2>Mockup Usage:</h2>
        <Album
          width={400}
          height={200}
          enableKeyBoardControl
          enableThumbs
          showButton
          customButtons={{
            icon: <Icon name="xiazai" />,
            onClick: () => {
              console.log('Download.');
            },
          }}
          thumbPlacement={'right'}
          thumbBackground={'#000'}
          ref={(album) => { this.album = album; }}
        >
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
        <h2>Method Usage:</h2>
        <h3>single pic with src:</h3>
        <button onClick={this.onClickSingle.bind(this)}>show one pic</button>
        <h3>multiple pic with Photos</h3>
        <button onClick={this.onClickMultiple.bind(this)}>show multiple pic</button>
      </div>
    );
  }
}

module.exports = Demo;
