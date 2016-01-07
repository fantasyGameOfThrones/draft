import { Map, List } from 'immutable';
import { randomSnakeOrder, randomValueFromArray } from './helpers';

/* State shape

78890: {
  status: 'NOT_STARTED' || 'IN_PROGRESS' || 'COMPLETED'
  users: [123, 456, 789],
  rosterByUserId: {
    123: [],
    456: [],
    789: []
  },
  availableCharacters: [1, 2, 3, 4, 5, 6, 7],
  order: [456, 789, 123, 123, 456, 789]
  pick: 1 // Index of order
},
78891: {...},
78892: {...},

*/

export const DRAFT_ROUNDS = 6; // TODO: Make this not hard coded
export const INITIAL_APP_STATE = Map();
export const INITIAL_LEAGUE_STATE = Map({
  status: 'NOT_STARTED',
  rosterByUserId: Map(),
  availableCharacters: getAllCharacterIds()
});

export function addUser (state, {userId}) {
  return state.update(
    'users',
    List(),
    (users) => users.push(userId)
  );
};

export function removeUser (state, {userId}) {
  return state.update(
    'users',
    (users) => users.filter((user) => user !== userId)
  );
};

export function startDraft (state) {
  return state.merge({
    order: getDraftOrder(state),
    pick: 0,
    status: 'IN_PROGRESS'
  });
};

export function endDraft (state) {
  return state.set('status', 'COMPLETED')
};

export function resetDraft (state) {
  return state
    .delete('order')
    .delete('pick')
    .set('status', 'NOT_STARTED')
}

export function draftCharacter (state, {userId, characterId}) {
  if (typeof userId !== 'number' || userId === undefined) {
    throw new Error('Can\'t draft a character without a userId')
  } else if (typeof characterId !== 'number' || characterId === undefined) {
    throw new Error('Can\'t draft a character without a characterId')
  }

  return state
    // Remove character from available characters array
    .update(
      'availableCharacters',
      (characters) => characters.filter((c) => c !== characterId)
    )
    // Add character to user's roster array
    // Automatically create a roster array if one doesn't exist yet
    .updateIn(
      ['rosterByUserId', userId],
      List(),
      (user) => user.push(characterId)
    )
    // increment current pick
    .update(
      'pick',
      (current) => current + 1
    )
};

export function randomAvailableCharacterId (state) {
  return randomValueFromArray(state.get('availableCharacters').toJS())
};

export function draftIsOver (state) {
  return state.get('pick') >= state.get('order').size;
};

function getDraftOrder(state) {
  return List(randomSnakeOrder(state.get('users').toJS(), DRAFT_ROUNDS));
}

// TODO: Hook this up to a database
function getAllCharacterIds() {
  return List(require('../characters.json'))
    .map((character) => character.id);
}