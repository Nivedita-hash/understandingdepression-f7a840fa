import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import {
  trackVideoStart,
  trackVideoComplete,
  startPageTimer,
  endPageTimer,
} from '@/lib/analytics';
import { markVideoCompleted, startPageTime, sendPageTime } from '@/lib/surveyData';

// Replace this with your uploaded MP4 asset URL (e.g. a CDN /__l5e/assets-v1/... path)
const VIDEO_SRC = '/narrative-video.mp4';

const VIDEO_END_THRESHOLD = 20;

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const VideoPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showNext, setShowNext] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const maxReachedRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startPageTimer('video_page');
    startPageTime('video');
    return () => endPageTimer('video_page');
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const target = parseFloat(e.target.value);
    // Prevent seeking forward beyond max watched point
    if (target > maxReachedRef.current + 1) {
      v.currentTime = maxReachedRef.current;
    } else {
      v.currentTime = target;
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    // Anti-seek forward
    if (t > maxReachedRef.current + 2) {
      v.currentTime = maxReachedRef.current;
      return;
    }
    maxReachedRef.current = Math.max(maxReachedRef.current, t);
    setCurrentTime(t);

    if (v.duration > 0 && v.duration - t <= VIDEO_END_THRESHOLD) {
      setShowNext(true);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (!startedRef.current) {
      startedRef.current = true;
      trackVideoStart();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!completedRef.current) {
      completedRef.current = true;
      trackVideoComplete();
      markVideoCompleted();
      setShowNext(true);
    }
  };

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
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
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-black group"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onPlay={handlePlay}
                onPause={() => setIsPlaying(false)}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onVolumeChange={(e) => {
                  setVolume(e.currentTarget.volume);
                  setIsMuted(e.currentTarget.muted);
                }}
                controlsList="nodownload noremoteplayback noplaybackrate"
                disablePictureInPicture
              />

              {/* Center play overlay when paused */}
              {!isPlaying && (
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
                {/* Progress */}
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

          {/* Gated Next Button */}
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
