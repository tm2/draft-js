/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule randomizeBlockMapKeys
 * @typechecks
 * 
 */

/*
 * Returns a new randomized keys blockmap that will
 * also respect nesting keys rules
 */
'use strict';

var BlockMapBuilder = require('./BlockMapBuilder');
var ContentBlock = require('./ContentBlock');
var generateNestedKey = require('./generateNestedKey');
var generateRandomKey = require('./generateRandomKey');

function randomizeBlockMapKeys(blockMap) {
  var newKeyHashMap = {};
  var contentBlocks = blockMap.map(function (block, blockKey) {
    var parentKey = block.getParentKey();

    var newKey = newKeyHashMap[blockKey] = parentKey ? newKeyHashMap[parentKey] ? // we could be inserting just a fragment
    generateNestedKey(newKeyHashMap[parentKey]) : generateNestedKey(parentKey) : generateRandomKey();

    return new ContentBlock({
      key: newKey,
      type: block.getType(),
      depth: block.getDepth(),
      text: block.getText(),
      characterList: block.getCharacterList()
    });
  }).toArray();

  return BlockMapBuilder.createFromArray(contentBlocks);
}

module.exports = randomizeBlockMapKeys;