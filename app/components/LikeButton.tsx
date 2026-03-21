'use client'

import { useState, useEffect } from 'react'

type LikeButtonProps = {
  slug: string
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch(`/api/likes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.likes)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const handleLike = async () => {
    if (liked) return

    try {
      const res = await fetch(`/api/likes/${slug}`, { method: 'POST' })
      const data = await res.json()
      setLikes(data.likes)
      setLiked(true)
    } catch {
      // silently fail
    }
  }

  return (
    <div className="flex items-center gap-2 mt-8">
      <button
        onClick={handleLike}
        disabled={liked || loading}
        aria-label={liked ? '이미 좋아요를 눌렀습니다' : '좋아요'}
        className={[
          'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
          liked
            ? 'border-red-300 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
            : 'border-neutral-200 bg-white text-neutral-600 hover:border-red-300 hover:text-red-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-red-800 dark:hover:text-red-400',
          'disabled:cursor-not-allowed',
        ].join(' ')}
      >
        <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
        <span>{loading ? '...' : likes}</span>
      </button>
    </div>
  )
}
