const initialState = {
    charts: [
        {

        }
    ],
    trending: [
        {

        }
    ],
    genres: [
        {

        }
    ],
    playlist: [
        {

        }
    ],
    currentSong: {

    },
    likedSongs: [

    ]
}

const currencyReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_CHARTS': 
            return {
                ...state,
                charts: action.payload
            }
        case 'SET_TRENDING':
            return {
                ...state,
                trending: action.payload
            }
        case 'SET_GENRES':
            return {
                ...state,
                genres: action.payload
            }
        case 'SET_PLAYLIST':
            return {
                ...state,
                playlist: action.payload
            }
        case 'SET_CURRENT_SONG':
            return {
                ...state,
                currentSong: action.payload
            }
        case 'SET_LIKED_SONGS': 
            return {
                ...state,
                likedSongs: [...state.likedSongs, action.payload]
            }
        default: 
            return state
    }
}

export default currencyReducer