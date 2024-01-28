import React, { useEffect, useState, useRef } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AnchorIcon from '@mui/icons-material/Anchor';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom'
import { chart } from '../../data/chart';
import { trending } from '../../data/Trending';
import { genres } from '../../data/Genres';
import { playlist } from '../../data/Playlist';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@mui/material/Slider';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
export default function PlayerComponent() {
    const chartItems = useSelector((state) => state.charts)
    const trendingItems = useSelector((state) => state.trending)
    const genresItems = useSelector((state) => state.genres)
    const playlistItems = useSelector((state) => state.playlist)
    const currentSong = useSelector((state) => state.currentSong)
    const likedSongs = useSelector((state) => state.likedSongs)
    const [likedStatus, setLikedStatus] = useState({});
    const [isActive, setIsActive] = useState(false)
    const [paused, setPaused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [position, setPosition] = useState(0);
    const [volume, setVolume] = useState(50);
    const [timerActive, setTimerActive] = useState(false);
    const [savedPosition, setSavedPosition] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const audioRef = useRef(new Audio());
    const prevVolume = useRef(null);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({ type: 'SET_CHARTS', payload: chart })
        dispatch({ type: 'SET_TRENDING', payload: trending })
        dispatch({ type: 'SET_GENRES', payload: genres })
        dispatch({ type: 'SET_PLAYLIST', payload: playlist })
    }, [])
    const playSong = (item, index) => {
        dispatch({ type: 'SET_CURRENT_SONG', payload: item })
        setPosition(0)
        setIsActive(true)
        setCurrentSongIndex(index);
        audioRef.current.addEventListener('loadeddata', () => {
            if (isActive && !paused) {
                audioRef.current.play();
            }
        });
        audioRef.current.src = item.music;
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
    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        return formattedTime;
    };
    useEffect(() => {
        setSavedPosition(audioRef.current.currentTime);
        audioRef.current.src = currentSong.music;
        if (isActive && !paused) {
            setTimerActive(true);
            audioRef.current.currentTime = savedPosition;
            audioRef.current.play();
            const timerInterval = setInterval(() => {
                setPosition((prevPosition) => {
                    if (prevPosition + 1 > currentSong.time) {
                        clearInterval(timerInterval);
                        setTimerActive(false);
                        return 0;
                    }
                    return prevPosition + 1;
                });
            }, 1000);
            return () => {
                clearInterval(timerInterval);
                setTimerActive(false);
            };
        } else if (isActive) {
            audioRef.current.currentTime = savedPosition;
        } else {
            audioRef.current.pause();
            setTimerActive(false);
        }
    }, [isActive, paused, currentSong.music, savedPosition, currentSong.time]);
    
    
    const handleVolumeChange = (event, newValue) => {
        audioRef.current.volume = volume / 100;
        event.preventDefault();
        setVolume(newValue);
    };
    const muteSong = () => {
        const newVolume = volume === 0 ? prevVolume.current || 50 : 0;
        setVolume(newVolume);
        audioRef.current.volume = newVolume / 100;
        prevVolume.current = volume === 0 ? 50 : volume
    }

    const playNextSong = () => {
        const nextIndex = (currentSongIndex + 1) % chartItems.length;
        if (chartItems[nextIndex]) {
            playSong(chartItems[nextIndex], nextIndex);
        } else {
            playSong(chartItems[0], 0);
        }
    };
    const playPreviousSong = () => {
        const prevIndex = (currentSongIndex - 1 + chartItems.length) % chartItems.length;

        if (chartItems[prevIndex]) {
            playSong(chartItems[prevIndex], prevIndex);
        } else {
            playSong(chartItems[chartItems.length - 1], chartItems.length - 1);
        }
    };
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
                                {filteredLikedSongs.map((item, index) => {
                                    return (
                                        <div className="Player__liked-item" onClick={() => playSong(item, index)}>
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
                                            <div onClick={() => playSong(item, index)} className='Player__item-content'>
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
                                                <div className='Player__item-time'>{formatTime(item.time)}</div>
                                            </div>
                                            <div className='Player__item-like' onClick={() => saveSong(item)}>
                                                <FavoriteIcon className={likedStatus[`${item.album}_${item.name}`] ? 'liked' : ''} />
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
                                        return (
                                            <div className="Player__trending-item" key={index}>
                                                <img src={item.img} alt="" />
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <FavoriteIcon className={likedStatus[`${currentSong.album}_${currentSong.name}`] ? 'liked' : ''} />
                    </div>
                </div>
                <div className='Player__item-audio'>
                    <div className='Player__audio-btn'>
                        <button className='audio__btn-prev'>
                            <ArrowBackIosNewIcon fontSize='small' onClick={playPreviousSong}/>
                        </button>
                        <IconButton
                            aria-label={paused ? 'play' : 'pause'}
                            onClick={() => setPaused(!paused)}
                        >
                            {paused ? (
                                <PlayArrowRounded
                                    sx={{ fontSize: '2rem' }}
                                />
                            ) : (
                                <PauseRounded sx={{ fontSize: '2rem' }} />
                            )}
                        </IconButton>
                        <button className='audio__btn-next' onClick={playNextSong}>
                            <ArrowForwardIosIcon fontSize='small' />
                        </button>
                    </div>
                    <div className="audio__slider">
                        <p>{formatDuration(position)}</p>
                        <Slider className='play__bar'
                            value={position}
                            min={0}
                            step={1}
                            max={currentSong.time}
                            onChange={(_, value) => {
                                setPosition(value);
                                audioRef.current.currentTime = value;
                              }}
                        />
                        <p>{formatTime(currentSong.time)}</p>
                    </div>
                </div>
                <div className="Player__item-volume">
                    <div onClick={() => muteSong()}>
                        {volume === 0 ? <VolumeMuteIcon /> : <VolumeDownIcon />}
                    </div>
                    <Slider
                        value={volume}
                        min={0}
                        max={100}
                        onChange={handleVolumeChange}
                        className='volume__bar'
                    />
                </div>
            </div>
        </div>
    )
}
