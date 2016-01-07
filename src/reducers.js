import { 
  addUser,
  removeUser,
  startDraft,
  endDraft,
  resetDraft,
  draftCharacter,
  draftIsOver,
  randomAvailableCharacterId,
  INITIAL_APP_STATE,
  INITIAL_LEAGUE_STATE
} from './core';

// This reducer will filter actions from all leagues,
// grabbing only that league's state and delegating 
// action handling to the league reducer
export function appReducer (state = INITIAL_APP_STATE, action) {
  console.log(action);
  switch(action.type) {
    case 'USER_CONNECTED':
    case 'USER_DISCONNECTED':
    case 'START_DRAFT':
    case 'RESET_DRAFT':
    case 'DRAFT_CHARACTER':
    case 'DRAFT_CHARACTER_AUTO':
      return state.update(
        action.payload.leagueId,
        INITIAL_LEAGUE_STATE,
        (leagueState) => leagueReducer(leagueState, action)
      );
  }
  return state;
};

export function leagueReducer (state = INITIAL_LEAGUE_STATE, action) {
  switch (action.type) {
    case 'USER_CONNECTED':
      return addUser(state, action.payload);
    case 'USER_DISCONNECTED':
      return removeUser(state, action.payload);
    case 'START_DRAFT':
      return startDraft(state);
    case 'RESET_DRAFT':
      return resetDraft(state);
    case 'DRAFT_CHARACTER':
      if (draftIsOver(state)) return endDraft(state);
      return draftCharacter(state, action.payload);
    case 'DRAFT_CHARACTER_AUTO':
      if (draftIsOver(state)) return endDraft(state);
      action.payload.characterId = randomAvailableCharacterId(state)
      return draftCharacter(state, action.payload);
  }
  return state;
};