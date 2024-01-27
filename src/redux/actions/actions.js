export const setCharts = (items) => {
    return {
        type: 'SET_CHARTS',
        payload: items,
    }
}

export const setTrending = (items) => {
    return {
        type: 'SET_TRENDING',
        payload: items,
    }
}

export const setGenres = (items) => {
    return {
        type: 'SET_GENRES',
        payload: items
    }
}

export const setPlaylist = (items) => {
    return {
        type: 'SET_PLAYLIST',
        payload: items
    }
}

export const setCurrentSong = (item) => {
    return {
        type: 'SET_CURRENT_SONG',
        payload: item
    }
}

export const setLikedSongs = (items) => {
    return {
        type: 'SET_LIKED_SONGS',
        payload: items
    }
}