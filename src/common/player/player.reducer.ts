import { Action } from "@ngrx/store";
import { PlayerActions } from "./player.actions";
import { Track } from "./track.interface";
import { StorageManager, Field } from "../storage/storage-manager.provider";

export enum AudioState {
	UNLOADED,
	LOADING,
	LOADED
}

export interface PlayerState {
	volume: number;
	isShuffle: boolean;
	isRepeat: boolean;
	isPlaying: boolean;
	isMuted: boolean;
	currentTrack: Track;
	trackListDownloaded: boolean;
	audioState: AudioState;
	faveIds: string[],
	trackFilter: string,
}

const defaultState: PlayerState = {
	volume: 30,
	isShuffle: true,
	isRepeat: false,
	isPlaying: false,
	isMuted: false,
	currentTrack: null,
	trackListDownloaded: false,
	audioState: AudioState.UNLOADED,
	faveIds: StorageManager.getItem(Field.FAVE_IDS, []),
	trackFilter: '',
};

export function PlayerReducer(state: PlayerState = defaultState, action: Action): any  {
	switch (action.type) {

		case PlayerActions.TOGGLE_SETTING:
			const changedSetting = {};
			changedSetting[action.payload] = !state[action.payload];
			return Object.assign({}, state, changedSetting);

		case PlayerActions.SET_VOLUME:
			return Object.assign({}, state, {volume: action.payload});

		case PlayerActions.SELECT_TRACK:
			const changedState = Object.assign({}, state, {currentTrack: action.payload});
			changedState.isPlaying = (action.payload === null) ?
				false :
				true;
			return changedState;

		case PlayerActions.SET_AUDIO_STATE:
			const changedAudioState = {audioState: action.payload};
			return Object.assign({}, state, changedAudioState);

		case PlayerActions.SET_LIST_DOWNLOADED:
			return Object.assign({}, state, {trackListDownloaded: action.payload});

		case PlayerActions.TOGGLE_FAVE_TRACK:
			// check if track needs to be added or removed
			const file = action.payload.file.substr(0, action.payload.file.length - 4);
			const faveIds = (state.faveIds.indexOf(file) !== -1) ?
				state.faveIds.filter(faveId => faveId !== file) :
				state.faveIds.concat(file);
			return Object.assign({}, state, {faveIds});

		case PlayerActions.SET_SEARCH_FILTER:
			const trackFilter = action.payload;
			return Object.assign({}, state, {trackFilter});

		default:
			return state;
	}
}
