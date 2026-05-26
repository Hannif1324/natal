'use client'

import { useEffect, useRef, useState } from 'react'

// Hook for scroll-triggered animations
export function useScrollAnimation(options = {}) {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    // Once visible, stop observing (animate only once)
                    if (ref.current) observer.unobserve(ref.current)
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px'
            }
        )

        if (ref.current) observer.observe(ref.current)

        return () => {
            if (ref.current) observer.unobserve(ref.current)
        }
    }, [options.threshold, options.rootMargin])

    return { ref, isVisible }
}

// Animation wrapper component
export function AnimateOnScroll({
    children,
    animation = 'fadeUp',
    delay = 0,
    duration = 0.6,
    className = ''
}) {
    const { ref, isVisible } = useScrollAnimation()

    const animations = {
        fadeUp: {
            hidden: 'opacity-0 translate-y-8',
            visible: 'opacity-100 translate-y-0'
        },
        fadeDown: {
            hidden: 'opacity-0 -translate-y-8',
            visible: 'opacity-100 translate-y-0'
        },
        fadeLeft: {
            hidden: 'opacity-0 translate-x-8',
            visible: 'opacity-100 translate-x-0'
        },
        fadeRight: {
            hidden: 'opacity-0 -translate-x-8',
            visible: 'opacity-100 translate-x-0'
        },
        fadeIn: {
            hidden: 'opacity-0',
            visible: 'opacity-100'
        },
        scaleUp: {
            hidden: 'opacity-0 scale-95',
            visible: 'opacity-100 scale-100'
        },
        slideUp: {
            hidden: 'opacity-0 translate-y-12',
            visible: 'opacity-100 translate-y-0'
        }
    }

    const anim = animations[animation] || animations.fadeUp

    return (
        <div
            ref={ref}
            className={`transform transition-all ${className}`}
            style={{
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div className={`${isVisible ? anim.visible : anim.hidden} transition-all ${className.includes('h-full') ? 'h-full' : ''}`}
                style={{
                    transitionDuration: `${duration}s`,
                    transitionDelay: `${delay}s`,
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                {children}
            </div>
        </div>
    )
}

// Stagger children animation
export function StaggerChildren({ children, staggerDelay = 0.1, className = '' }) {
    const { ref, isVisible } = useScrollAnimation()

    return (
        <div ref={ref} className={className}>
            {Array.isArray(children) ? children.map((child, index) => (
                <div
                    key={index}
                    className={`transform transition-all duration-500 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                        }`}
                    style={{
                        transitionDelay: `${index * staggerDelay}s`
                    }}
                >
                    {child}
                </div>
            )) : children}
        </div>
    )
}
