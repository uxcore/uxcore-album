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
export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleOnClock() {
    const index = 0;
    const data = [
      { thumbnail: 'https://img.alicdn.com/tfs/TB1hDKhpb2pK1RjSZFsXXaNlXXa-440-103.png' },
      { thumbnail: 'https://img.alicdn.com/tfs/TB1rRe_ohTpK1RjSZFGXXcHqFXa-770-734.png' },
    ];
    Album.show({
      photos: data.map((img, i) => <Album.Photo src={img.thumbnail} key={i} />),
      current: index,
    });
  }

  render() {
    return (
      <div onClick={this.handleOnClock}>111111</div>
    );
  }
}
