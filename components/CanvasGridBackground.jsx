"use client";

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const CanvasGridBackground = ({
    src,
    type,
    solidColor = '#121214',
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

        const drawImg = (box) => {
            box.d = Math.hypot((box.x - m.x), (box.y - m.y));
            // Maximum distance for clamping based on viewport size
            const maxDistance = Math.hypot(cw, ch) || 1000;
            box.s = 1 - gsap.utils.clamp(0, 1, box.d / maxDistance / m.s);
            if (box.s < 0.001) return;
            
            let scaleFactor = box.s;
            
            const source = isVideo ? videoRef.current : mediaElement;
            if (source && (isImageLoaded || isVideo)) {
                // Map canvas grid coordinate to media coordinates
                const mediaX = sx + (box.x / cw) * sw;
                const mediaY = sy + (box.y / ch) * sh;
                const mediaW = (boxSize / cw) * sw;
                const mediaH = (boxSize / ch) * sh;

                // Zoom in on the source rect based on pointer proximity (scaleFactor)
                let zoomW = mediaW * (1 - scaleFactor);
                let zoomH = mediaH * (1 - scaleFactor);
                let zoomX = mediaX + (mediaW - zoomW) / 2;
                let zoomY = mediaY + (mediaH - zoomH) / 2;

                // Draw cropped video frame
                if (blur > 0) ctx.filter = `blur(${blur}px)`;
                ctx.drawImage(source, zoomX, zoomY, zoomW, zoomH, box.x, box.y, boxSize, boxSize);
                if (blur > 0) ctx.filter = 'none';

                // Subtly darken non-hovered regions of the mosaic grid
                if (darken > 0) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${darken * (1 - scaleFactor)})`;
                    ctx.fillRect(box.x, box.y, boxSize, boxSize);
                }
            } else {
                // Solid Mode fill
                if (scaleFactor > 0.001) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.03 * scaleFactor})`;
                    ctx.fillRect(box.x, box.y, boxSize, boxSize);
                }
            }

            // Draw thin cell border
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 + 0.12 * scaleFactor})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(box.x, box.y, boxSize, boxSize);
        };

        const drawDots = (box) => {
            ctx.fillStyle = dotColor;
            ctx.beginPath();
            ctx.arc(box.x, box.y, boxSize * 0.15 * box.s, 0, T);
            ctx.fill();
        };

        const update = () => {
            const maxDistance = Math.hypot(cw, ch) || 1000;
            const d = Math.hypot((m.x - m.x2), (m.y - m.y2));
            sTo(d / maxDistance * 2);

            // Clean canvas
            ctx.clearRect(0, 0, cw, ch);

            if (isVideo) {
                const video = videoRef.current;
                if (video && video.readyState >= 2) {
                    calculateCoverCrop(video.videoWidth, video.videoHeight);
                    
                    // 1. Draw blurred & darkened background layer
                    if (blur > 0) ctx.filter = `blur(${blur}px)`;
                    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
                    if (blur > 0) ctx.filter = 'none';

                    if (darken > 0) {
                        ctx.fillStyle = `rgba(0, 0, 0, ${darken})`;
                        ctx.fillRect(0, 0, cw, ch);
                    }

                    // 2. Draw mosaic grid boxes on top
                    boxes.forEach(drawImg);
                }
            } else if (isImage && mediaElement && isImageLoaded) {
                calculateCoverCrop(mediaElement.width, mediaElement.height);

                // 1. Draw blurred & darkened background layer
                if (blur > 0) ctx.filter = `blur(${blur}px)`;
                ctx.drawImage(mediaElement, sx, sy, sw, sh, 0, 0, cw, ch);
                if (blur > 0) ctx.filter = 'none';

                if (darken > 0) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${darken})`;
                    ctx.fillRect(0, 0, cw, ch);
                }

                // 2. Draw mosaic grid boxes on top
                boxes.forEach(drawImg);
            } else {
                // Solid Mode (No background video/image)
                ctx.fillStyle = solidColor;
                ctx.fillRect(0, 0, cw, ch);

                // Draw solid grid cells (only outlines and hover highlights)
                boxes.forEach(drawImg);
            }

            // Draw dots at the vertices
            boxes.forEach(drawDots);
        };

        // Initialize Image source if image type
        if (isImage) {
            mediaElement = new Image();
            mediaElement.src = src;
            mediaElement.onload = () => {
                isImageLoaded = true;
                setIsLoaded(true);
            };
        }

        // Play/Tick video or image only when visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (isVideo && videoRef.current) {
                            videoRef.current.play().catch(() => {});
                        }
                        gsap.ticker.add(update);
                    } else {
                        if (isVideo && videoRef.current) {
                            videoRef.current.pause();
                        }
                        gsap.ticker.remove(update);
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
        };

        const handleResize = () => {
            cw = c.clientWidth || window.innerWidth;
            ch = c.clientHeight || window.innerHeight;
            c.width = cw;
            c.height = ch;
            initBoxes();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('pointermove', handlePointerMove);

        return () => {
            gsap.ticker.remove(update);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointermove', handlePointerMove);
            observer.disconnect();
        };
    }, [src, type, solidColor, dotColor, boxSize, blur, darken]);

    const isVideo = src && (type === 'video' || (!type && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src)));

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {isVideo && (
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
