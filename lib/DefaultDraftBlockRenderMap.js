/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DefaultDraftBlockRenderMap
 * 
 */

'use strict';

var _require = require('immutable');

var Map = _require.Map;

var React = require('react');

var cx = require('fbjs/lib/cx');

var UL_WRAP = React.createElement('ul', { className: cx('public/DraftStyleDefault/ul') });
var OL_WRAP = React.createElement('ol', { className: cx('public/DraftStyleDefault/ol') });
var PRE_WRAP = React.createElement('pre', { className: cx('public/DraftStyleDefault/pre') });

module.exports = Map({
  'header-one': {
    element: 'h1',
    nestingEnabled: false
  },
  'header-two': {
    element: 'h2',
    nestingEnabled: false
  },
  'header-three': {
    element: 'h3',
    nestingEnabled: false
  },
  'header-four': {
    element: 'h4',
    nestingEnabled: false
  },
  'header-five': {
    element: 'h5',
    nestingEnabled: false
  },
  'header-six': {
    element: 'h6',
    nestingEnabled: false
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: UL_WRAP,
    nestingEnabled: false
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: OL_WRAP,
    nestingEnabled: false
  },
  'blockquote': {
    element: 'blockquote',
    nestingEnabled: false
  },
  'atomic': {
    element: 'figure',
    nestingEnabled: false
  },
  'code-block': {
    element: 'pre',
    wrapper: PRE_WRAP,
    nestingEnabled: false
  },
  'unstyled': {
    element: 'div',
    nestingEnabled: false
  }
});