"use client";

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const CanvasGridBackground = ({
    src,
    type,
    bgSelector,
    solidColor = 'transparent',
    dotColor = '#ff2d2d',
    boxSize = 100,
    opacityClass = 'opacity-[0.7] dark:opacity-[0.8]',
    blur = 0,
    darken = 0.4
}) => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        const ctx = c.getContext('2d');
        
        let cw = c.clientWidth || window.innerWidth;
        let ch = c.clientHeight || window.innerHeight;
        c.width = cw;
        c.height = ch;

        const T = Math.PI * 2;
        const m = { x: cw / 2, y: ch / 2, s: 1.5, x2: cw / 2, y2: ch / 2 };
        
        const xTo = gsap.quickTo(m, "x", { duration: 1, ease: "expo" });
        const yTo = gsap.quickTo(m, "y", { duration: 1, ease: "expo" });
        const sTo = gsap.quickTo(m, "s", { duration: 2, ease: "power2" });
        
        let boxes = [];

        // Function to initialize grid boxes based on dimensions
        const initBoxes = () => {
            boxes = [];
            for (let x = 0; x <= cw + boxSize; x += boxSize) {
                for (let y = 0; y <= ch + boxSize; y += boxSize) {
                    boxes.push({ x, y, d: 0, s: 0 });
                }
            }
        };
        initBoxes();

        // Determine if it is a video or image
        const isVideo = src && (type === 'video' || (!type && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src)));
        const isImage = src && !isVideo;

        let mediaElement = null;
        let isImageLoaded = false;
        let isTicking = false;

        // Cover crop math parameters
        let sx = 0, sy = 0, sw = cw, sh = ch;

        const calculateCoverCrop = (mediaW, mediaH) => {
            const mediaAspect = mediaW / mediaH;
            const canvasAspect = cw / ch;

            if (mediaAspect > canvasAspect) {
                sh = mediaH;
                sw = mediaH * canvasAspect;
                sx = (mediaW - sw) / 2;
                sy = 0;
            } else {
                sw = mediaW;
                sh = mediaW / canvasAspect;
                sx = 0;
                sy = (mediaH - sh) / 2;
            }
        };

        let currentSource = null;
        let currentIsMediaReady = false;

        const drawImg = (box) => {
            box.d = Math.hypot((box.x - m.x), (box.y - m.y));
            // Limit distance of influence (radius) to 300px around cursor for high performance
            const maxDistance = 300;
            box.s = 1 - gsap.utils.clamp(0, 1, box.d / maxDistance);
            
            if (box.s < 0.01) {
                // Out of range: draw a static faint border and return!
                // Skip all heavy drawing, calculations, and DOM lookups.
                ctx.strokeStyle = `rgba(255, 255, 255, 0.04)`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(box.x, box.y, boxSize, boxSize);
                return;
            }
            
            let scaleFactor = box.s;

            if (currentSource && currentIsMediaReady) {
                // Map canvas grid coordinate to media coordinates
                const mediaW = currentSource.videoWidth || currentSource.naturalWidth || currentSource.width || 1920;
                const mediaH = currentSource.videoHeight || currentSource.naturalHeight || currentSource.height || 1080;
                calculateCoverCrop(mediaW, mediaH);

                const mediaX = sx + (box.x / cw) * sw;
                const mediaY = sy + (box.y / ch) * sh;
                const cellW = (boxSize / cw) * sw;
                const cellH = (boxSize / ch) * sh;

                // Zoom in on the source rect based on pointer proximity (scaleFactor)
                let zoomW = cellW * (1 - scaleFactor);
                let zoomH = cellH * (1 - scaleFactor);
                let zoomX = mediaX + (cellW - zoomW) / 2;
                let zoomY = mediaY + (cellH - zoomH) / 2;

                // Draw cropped frame
                if (blur > 0) ctx.filter = `blur(${blur}px)`;
                ctx.drawImage(currentSource, zoomX, zoomY, zoomW, zoomH, box.x, box.y, boxSize, boxSize);
                if (blur > 0) ctx.filter = 'none';

                // Subtly darken non-hovered regions of the mosaic grid
                if (darken > 0) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${darken * (1 - scaleFactor)})`;
                    ctx.fillRect(box.x, box.y, boxSize, boxSize);
                }
            } else {
                // Solid Mode fill
                ctx.fillStyle = `rgba(255, 255, 255, ${0.03 * scaleFactor})`;
                ctx.fillRect(box.x, box.y, boxSize, boxSize);
            }

            // Draw thin cell border
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 + 0.12 * scaleFactor})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(box.x, box.y, boxSize, boxSize);
        };

        const drawDots = (box) => {
            if (box.s < 0.01) return; // Skip drawing dot entirely if it has 0 radius!
            ctx.fillStyle = dotColor;
            ctx.beginPath();
            ctx.arc(box.x, box.y, boxSize * 0.15 * box.s, 0, T);
            ctx.fill();
        };

        const update = () => {
            const maxDistance = Math.hypot(cw, ch) || 1000;
            const d = Math.hypot((m.x - m.x2), (m.y - m.y2));
            sTo(d / maxDistance * 2);

            // Resolve source element once per frame
            if (bgSelector) {
                currentSource = document.querySelector(bgSelector);
                currentIsMediaReady = currentSource && (currentSource.tagName === 'VIDEO' ? currentSource.readyState >= 2 : currentSource.complete);
            } else if (isVideo) {
                currentSource = videoRef.current;
                currentIsMediaReady = currentSource && currentSource.readyState >= 2;
            } else if (isImage) {
                currentSource = mediaElement;
                currentIsMediaReady = isImageLoaded;
            } else {
                currentSource = null;
                currentIsMediaReady = false;
            }

            // Clean canvas
            ctx.clearRect(0, 0, cw, ch);

            if (currentSource && currentIsMediaReady) {
                const mediaW = currentSource.videoWidth || currentSource.naturalWidth || currentSource.width || 1920;
                const mediaH = currentSource.videoHeight || currentSource.naturalHeight || currentSource.height || 1080;
                calculateCoverCrop(mediaW, mediaH);

                if (!bgSelector) {
                    // 1. Draw blurred & darkened background layer
                    if (blur > 0) ctx.filter = `blur(${blur}px)`;
                    ctx.drawImage(currentSource, sx, sy, sw, sh, 0, 0, cw, ch);
                    if (blur > 0) ctx.filter = 'none';

                    if (darken > 0) {
                        ctx.fillStyle = `rgba(0, 0, 0, ${darken})`;
                        ctx.fillRect(0, 0, cw, ch);
                    }
                }
            } else {
                // Solid Mode (No background video/image)
                ctx.fillStyle = solidColor;
                ctx.fillRect(0, 0, cw, ch);
            }

            // 2. Draw mosaic grid boxes
            boxes.forEach(drawImg);

            // Draw dots at the vertices
            boxes.forEach(drawDots);

            // Check if we can pause the ticker
            const dx = Math.abs(m.x - m.x2);
            const dy = Math.abs(m.y - m.y2);
            const isSourceVideo = currentSource && currentSource.tagName === 'VIDEO';

            // Only tick continuously if the background is a playing video OR pointer is moving/GSAP is animating
            const needsContinuousTick = isSourceVideo || dx > 0.1 || dy > 0.1;

            if (!needsContinuousTick && isTicking) {
                gsap.ticker.remove(update);
                isTicking = false;
            }
        };

        // Initialize Image source if image type
        if (isImage) {
            mediaElement = new Image();
            mediaElement.src = src;
            mediaElement.onload = () => {
                isImageLoaded = true;
                setIsLoaded(true);
                update();
            };
        }

        // Play/Tick video or image only when visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!bgSelector && isVideo && videoRef.current) {
                            videoRef.current.play().catch(() => {});
                        }
                        update();
                        
                        // Check if it's a video to start continuous ticking
                        const source = bgSelector 
                            ? document.querySelector(bgSelector)
                            : (isVideo ? videoRef.current : mediaElement);
                        const isSourceVideo = source && source.tagName === 'VIDEO';
                        
                        if (isSourceVideo && !isTicking) {
                            isTicking = true;
                            gsap.ticker.add(update);
                        }
                    } else {
                        if (!bgSelector && isVideo && videoRef.current) {
                            videoRef.current.pause();
                        }
                        if (isTicking) {
                            gsap.ticker.remove(update);
                            isTicking = false;
                        }
                    }
                });
            },
            { threshold: 0.05 }
        );
        observer.observe(c);

        let cRect = c.getBoundingClientRect();

        const handlePointerMove = (e) => {
            cRect = c.getBoundingClientRect();
            m.x2 = e.clientX - cRect.left;
            m.y2 = e.clientY - cRect.top;
            xTo(m.x2);
            yTo(m.y2);
            
            if (!isTicking) {
                isTicking = true;
                gsap.ticker.add(update);
            }
        };

        const handleResize = () => {
            cw = c.clientWidth || window.innerWidth;
            ch = c.clientHeight || window.innerHeight;
            c.width = cw;
            c.height = ch;
            initBoxes();
            update();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('pointermove', handlePointerMove);

        return () => {
            if (isTicking) {
                gsap.ticker.remove(update);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointermove', handlePointerMove);
            observer.disconnect();
        };
    }, [src, type, bgSelector, solidColor, dotColor, boxSize, blur, darken]);

    const isVideoLocal = src && (type === 'video' || (!type && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src)));

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {isVideoLocal && !bgSelector && (
                <video
                    ref={videoRef}
                    src={src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="hidden"
                    onLoadedData={() => setIsLoaded(true)}
                />
            )}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${opacityClass}`}
            />
        </div>
    );
};

export default CanvasGridBackground;
