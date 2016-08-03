/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule convertFromRawToDraftState
 *
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ContentBlock = require('./ContentBlock');
var ContentState = require('./ContentState');
var DraftEntity = require('./DraftEntity');
var Immutable = require('immutable');

var DefaultDraftBlockRenderMap = require('./DefaultDraftBlockRenderMap');
var createCharacterList = require('./createCharacterList');
var decodeEntityRanges = require('./decodeEntityRanges');
var decodeInlineStyleRanges = require('./decodeInlineStyleRanges');
var generateRandomKey = require('./generateRandomKey');
var generateNestedKey = require('./generateNestedKey');

var Map = Immutable.Map;

function convertBlocksFromRaw(inputBlocks, fromStorageToLocal, blockRenderMap, parentKey, parentBlock) {
  return inputBlocks.reduce(function (result, block) {
    var key = block.key;
    var type = block.type;
    var text = block.text;
    var depth = block.depth;
    var inlineStyleRanges = block.inlineStyleRanges;
    var entityRanges = block.entityRanges;
    var blocks = block.blocks;
    var data = block.data;

    var parentBlockRenderingConfig = parentBlock ? blockRenderMap.get(parentBlock.type) : null;

    key = key || generateRandomKey();
    depth = depth || 0;
    inlineStyleRanges = inlineStyleRanges || [];
    entityRanges = entityRanges || [];
    blocks = blocks || [];
    data = Map(data);

    //key = parentKey && parentBlockRenderingConfig && parentBlockRenderingConfig.nestingEnabled ? generateNestedKey(parentKey, key) : key;

    key = parentKey ? generateNestedKey(parentKey, key) : key

    var inlineStyles = decodeInlineStyleRanges(text, inlineStyleRanges);

    // Translate entity range keys to the DraftEntity map.
    var filteredEntityRanges = entityRanges.filter(function (range) {
      return fromStorageToLocal.hasOwnProperty(range.key);
    }).map(function (range) {
      return _extends({}, range, { key: fromStorageToLocal[range.key] });
    });

    var entities = decodeEntityRanges(text, filteredEntityRanges);
    var characterList = createCharacterList(inlineStyles, entities);

    // Push parent block first
    result.push(new ContentBlock({ key: key, type: type, text: text, depth: depth, characterList: characterList, data: data }));

    // Then push child blocks
    result = result.concat(convertBlocksFromRaw(blocks, fromStorageToLocal, blockRenderMap, key, block));

    return result;
  }, []);
}

function convertFromRawToDraftState(rawState) {
  var blockRenderMap = arguments.length <= 1 || arguments[1] === undefined ? DefaultDraftBlockRenderMap : arguments[1];
  var blocks = rawState.blocks;
  var entityMap = rawState.entityMap;

  var fromStorageToLocal = {};
  Object.keys(entityMap).forEach(function (storageKey) {
    var encodedEntity = entityMap[storageKey];
    var type = encodedEntity.type;
    var mutability = encodedEntity.mutability;
    var data = encodedEntity.data;

    var newKey = DraftEntity.create(type, mutability, data || {});
    fromStorageToLocal[storageKey] = newKey;
  });

  var contentBlocks = convertBlocksFromRaw(blocks, fromStorageToLocal, blockRenderMap);
  return ContentState.createFromBlockArray(contentBlocks);
}

module.exports = convertFromRawToDraftState;
