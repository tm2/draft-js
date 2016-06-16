/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getSampleStateForTestingNestedBlocks
 * @typechecks
 * 
 */

'use strict';

var BlockMapBuilder = require('./BlockMapBuilder');
var CharacterMetadata = require('./CharacterMetadata');
var ContentBlock = require('./ContentBlock');
var ContentState = require('./ContentState');
var EditorState = require('./EditorState');
var Immutable = require('immutable');
var SampleDraftInlineStyle = require('./SampleDraftInlineStyle');
var SelectionState = require('./SelectionState');

var BOLD = SampleDraftInlineStyle.BOLD;
var ITALIC = SampleDraftInlineStyle.ITALIC;

var ENTITY_KEY = '123';

var BLOCKS = [new ContentBlock({
  key: 'a',
  type: 'header-one',
  text: 'Alpha',
  characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.EMPTY, 5))
}), new ContentBlock({
  key: 'b',
  type: 'blockquote',
  text: '',
  characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({
    style: BOLD,
    entity: ENTITY_KEY
  }), 5))
}), new ContentBlock({
  key: 'b/c',
  type: 'ordered-list-item',
  text: 'Charlie',
  characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({
    style: ITALIC,
    entity: null
  }), 7))
}), new ContentBlock({
  key: 'b/d',
  type: 'unordered-list-item',
  text: '',
  characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({
    style: ITALIC,
    entity: null
  }), 7))
}), new ContentBlock({
  key: 'b/d/e',
  type: 'header-one',
  text: 'Echo',
  characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({
    style: ITALIC,
    entity: null
  }), 7))
}), new ContentBlock({
  key: 'f',
  type: 'blockquote',
  text: 'Foxtrot',
  characterList: Immutable.List(Immutable.Repeat(CharacterMetadata.create({
    style: ITALIC,
    entity: null
  }), 7))
})];

var selectionState = new SelectionState({
  anchorKey: 'a',
  anchorOffset: 0,
  focusKey: 'e',
  focusOffset: 0,
  isBackward: false,
  hasFocus: true
});

var blockMap = BlockMapBuilder.createFromArray(BLOCKS);
var contentState = new ContentState({
  blockMap: blockMap,
  selectionBefore: selectionState,
  selectionAfter: selectionState
});

var editorState = EditorState.forceSelection(EditorState.createWithContent(contentState), selectionState);

function getSampleStateForTestingNestedBlocks() {
  return {
    editorState: editorState,
    contentState: contentState,
    selectionState: selectionState
  };
}

module.exports = getSampleStateForTestingNestedBlocks;