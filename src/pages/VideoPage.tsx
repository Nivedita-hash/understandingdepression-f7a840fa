import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import {
  trackVideoStart,
  trackVideoComplete,
  startPageTimer,
  endPageTimer,
} from '@/lib/analytics';
import { markVideoCompleted, startPageTime, sendPageTime } from '@/lib/surveyData';

const YT_VIDEO_ID = 'R38FR2y53_w';
const VIDEO_END_THRESHOLD = 20;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const VideoPage = () => {
  const navigate = useNavigate();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const maxReachedRef = useRef(0);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  const initPlayer = useCallback(() => {
    const create = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          controls: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            setReady(true);
            setDuration(e.target.getDuration?.() || 0);
            intervalRef.current = setInterval(() => {
              const p = playerRef.current;
              if (!p?.getCurrentTime || !p?.getDuration) return;
              const t = p.getCurrentTime();
              const d = p.getDuration();
              if (t > maxReachedRef.current + 2) {
                p.seekTo(maxReachedRef.current, true);
              } else {
                maxReachedRef.current = Math.max(maxReachedRef.current, t);
              }
              setCurrentTime(t);
              if (d > 0) setDuration(d);
              if (d > 0 && d - t <= VIDEO_END_THRESHOLD) setShowNext(true);
            }, 500);
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (e.data === YT?.PlayerState?.PLAYING) {
              setIsPlaying(true);
              if (!startedRef.current) {
                startedRef.current = true;
                trackVideoStart();
              }
            } else if (e.data === YT?.PlayerState?.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === YT?.PlayerState?.ENDED) {
              setIsPlaying(false);
              if (!completedRef.current) {
                completedRef.current = true;
                trackVideoComplete();
                markVideoCompleted();
                setShowNext(true);
              }
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      create();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = create;
    }
  }, []);

  useEffect(() => {
    startPageTimer('video_page');
    startPageTime('video');
    initPlayer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
      endPageTimer('video_page');
    };
  }, [initPlayer]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) {
      // First interaction: unmute on play
      p.unMute?.();
      setIsMuted(false);
    }
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) {
      p.unMute();
      setIsMuted(false);
    } else {
      p.mute();
      setIsMuted(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    if (!p) return;
    const val = parseFloat(e.target.value);
    p.setVolume(val * 100);
    setVolume(val);
    if (val === 0) {
      p.mute();
      setIsMuted(true);
    } else if (isMuted) {
      p.unMute();
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    if (!p) return;
    const target = parseFloat(e.target.value);
    if (target > maxReachedRef.current + 1) {
      p.seekTo(maxReachedRef.current, true);
    } else {
      p.seekTo(target, true);
      setCurrentTime(target);
    }
  };

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const revealControls = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const handleNext = () => {
    endPageTimer('video_page');
    sendPageTime('video');
    navigate('/video-transition');
  };

  return (
    <PageWrapper showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          <div
            ref={containerRef}
            onMouseMove={revealControls}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-black"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {/* YouTube iframe (no chrome) */}
              <div id="yt-player" className="absolute inset-0 w-full h-full pointer-events-none" />

              {/* Click-blocker overlay — intercepts all iframe clicks so YouTube
                  branding, title, and links are never reachable */}
              <div
                className="absolute inset-0"
                onClick={togglePlay}
              />

              {/* Center play button when paused */}
              {!isPlaying && ready && (
                <button
                  onClick={togglePlay}
                  aria-label="Play"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <span className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  </span>
                </button>
              )}

              {/* Custom controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pt-8 pb-3 transition-opacity duration-300 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek"
                  className="w-full h-1 accent-primary cursor-pointer"
                />

                <div className="flex items-center gap-3 mt-2 text-white/90 text-sm">
                  <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="hover:text-white">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>

                  <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="hover:text-white">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolume}
                      aria-label="Volume"
                      className="w-0 group-hover/vol:w-20 transition-all h-1 accent-primary cursor-pointer"
                    />
                  </div>

                  <span className="tabular-nums text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <div className="ml-auto">
                    <button onClick={enterFullscreen} aria-label="Fullscreen" className="hover:text-white">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showNext && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-10 text-center"
              >
                <button
                  onClick={handleNext}
                  className="nav-button-primary group text-lg px-8 py-3"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showNext && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please watch the video to continue.
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default VideoPage;
