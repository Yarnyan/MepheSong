import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AnchorIcon from '@mui/icons-material/Anchor';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom'
import { chart } from '../../data/chart';
import { trending } from '../../data/Trending';
import { genres } from '../../data/Genres';
import { playlist } from '../../data/Playlist';
import { useDispatch, useSelector } from 'react-redux';
export default function PlayerComponent() {
    const chartItems = useSelector((state) => state.charts)
    const trendingItems = useSelector((state) => state.trending)
    const genresItems = useSelector((state) => state.genres)
    const playlistItems = useSelector((state) => state.playlist)
    const currentSong = useSelector((state) => state.currentSong)
    const likedSongs = useSelector((state) => state.likedSongs)
    const [likedStatus, setLikedStatus] = useState({});
    const [isActive, setIsActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({ type: 'SET_CHARTS', payload: chart })
        dispatch({ type: 'SET_TRENDING', payload: trending })
        dispatch({ type: 'SET_GENRES', payload: genres })
        dispatch({ type: 'SET_PLAYLIST', payload: playlist })
    }, [])
    const playSong = (item) => {
        dispatch({ type: 'SET_CURRENT_SONG', payload: item })
        setIsActive(true)
    }
    const saveSong = (item) => {
        dispatch({ type: 'SET_LIKED_SONGS', payload: item })
        const uniqueId = `${item.album}_${item.name}`; 
        setLikedStatus((prevStatus) => ({
          ...prevStatus,
          [uniqueId]: !prevStatus[uniqueId],
        }));

    }
    const filteredLikedSongs = likedSongs.filter(
        (item) =>
            item.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className='Player__body'>
            <div className="Player__body-container">
                <div className="Player__container-navbar">
                    <div className="Player__navbar-logo">
                        <AnchorIcon fontSize='large' />
                        <p>MepheSong</p>
                    </div>
                    <nav className="Player__navbar">
                        <ul className='Player__navbar-items'>
                            <div className='Player__navbar-item active'>
                                <HomeIcon />
                                <Link>Home</Link>
                            </div>
                            <div className='Player__navbar-item'>
                                <SearchIcon />
                                <Link>Explorer</Link>
                            </div>
                            <div className='Player__navbar-item'>
                                <PersonIcon />
                                <Link>Your account</Link>
                            </div>
                            <div className='Player__navbar-item'>
                                <SettingsIcon />
                                <Link>Setting</Link>
                            </div>
                        </ul>
                    </nav>
                    <div className="Player__navbar-playlist">
                        <div className="Player__playlist-add">
                            <h1>My playlist</h1>
                            <AddIcon fontSize='small' />
                        </div>
                        <div className="Player__playlist-input">
                            <div className='Player__playlist-svg'>
                                <SearchIcon fontSize='small' />
                            </div>
                            <input type="text" placeholder='Search in library' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="Player__playlist-liked">
                            <div className="Player__liked-items">
                                {filteredLikedSongs.map((item) => {
                                    return (
                                        <div className="Player__liked-item" onClick={() => playSong(item)}>
                                            <div className='Player__item-name' style={{ marginTop: '15px', width: '100%', cursor: 'pointer' }}>
                                                <div>
                                                    <img src={item.img} alt="" />
                                                </div>
                                                <div className='song__avtor'>
                                                    <div style={{ color: '#fff' }}>{item.album}</div>
                                                    <div className='Player__song-name'>{item.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Player__container-player">
                    <div className="Player__container-subtitle">
                        <h1>Trending New Album and Playlist</h1>
                        <Link>See more</Link>
                    </div>
                    <div className="Player__container-popularArtist">
                        {playlistItems.map((item, index) => {
                            return (
                                <div className='Player__popularArtist-album' key={index}>
                                    <img src={item.img} alt="" />
                                    <div className='Album__title'>
                                        <p className='Album__title-avtor'>{item.name} &#729; {item.date}</p>
                                        <div onClick={() => saveSong(item)}>
                                            <FavoriteIcon className={likedStatus[`${item.album}_${item.name}`] ? 'liked' : ''} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="Player__container-chart">
                        <div className="Player__chart">
                            <h1>New Chart</h1>
                            <div className='Player__chart-content'>
                                <div className="Player__content-subtitle">
                                    <p className='Player__subtitle-title'>Title</p>
                                    <p className='Player__subtitle-album'>Album</p>
                                    <p className='Player__subtitle-time'>Time</p>
                                </div>
                                {chartItems.map((item, index) => {
                                    return (
                                        <div className="Player__chart-item" key={index}>
                                            <div onClick={() => playSong(item)} className='Player__item-content'>
                                                <div className='Player__item-number'>0{item.id}</div>
                                                <div className='Player__item-name'>
                                                    <div>
                                                        <img src={item.img} alt="" />
                                                    </div>
                                                    <div className='song__avtor'>
                                                        <div>{item.album}</div>
                                                        <div className='Player__song-name'>{item.name}</div>
                                                    </div>
                                                </div>
                                                <div className='Player__item-album'>{item.album}</div>
                                                <div className='Player__item-time'>{item.time}</div>
                                            </div>
                                            <div className='Player__item-like' onClick={() => saveSong(item)}>
                                                <FavoriteIcon className={likedStatus[`${item.album}_${item.name}`] ? 'liked' : ''}/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="Player__Artist">
                            <div className='Player__artist-trending'>
                                <div className="Player__container-subtitle">
                                    <h1>Trending Artist</h1>
                                    <Link>See more</Link>
                                </div>
                                <div className="Player__trending-items">
                                    {trendingItems.map((item, index) => {
                                        // const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                                        return (
                                            <div className="Player__trending-item" key={index}>
                                                <img src={item.img} alt="" />
                                                {/* <div className='Trending-title'>
                                                    {item.name}
                                                </div> */}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='Player__artist-genres'>
                                <div className="Player__container-subtitle">
                                    <h1>Genres</h1>
                                    <Link>See more</Link>
                                </div>
                                <div className="Player__genres-items">
                                    {genresItems.map((item, index) => {
                                        return (
                                            <div className="Player__genres-item" key={index}>
                                                <div className="genres-title">
                                                    {item.name}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`Player__footer ${isActive ? 'active' : null}`}>
                <div className='Player__item-name' style={{ width: '200px' }}>
                    <div>
                        <img src={currentSong.img} alt="" />
                    </div>
                    <div className='song__avtor'>
                        <div style={{ color: '#fff' }}>{currentSong.album}</div>
                        <div className='Player__song-name'>{currentSong.name}</div>
                    </div>
                </div>
                <div className='Player__item-like' onClick={() => saveSong(currentSong)}>
                    <FavoriteIcon className={likedStatus[`${currentSong.album}_${currentSong.name}`] ? 'liked' : ''}/>
                </div>
            </div>
        </div>
    )
}
