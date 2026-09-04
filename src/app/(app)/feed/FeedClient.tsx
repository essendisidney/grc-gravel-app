'use client'

import { useEffect, useState } from 'react'
import { getInitials, formatTimeAgo, getTierColor } from '@/lib/utils'
import { Heart, MessageCircle, Share2, Pin, Plus, X, Loader2 } from 'lucide-react'
import { addClubStory, getClubStories, getSession, type ClubStory } from '@/lib/localStore'
import KudosBoard from '@/components/club/KudosBoard'

export default function FeedClient({ posts: initialPosts, currentUserId }: {
  posts: any[], currentUserId?: string
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [creating, setCreating] = useState(false)
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const stories = getClubStories()
    if (!stories.length) return
    const mapped = stories.map(storyToPost)
    setPosts(prev => {
      const ids = new Set(prev.map(p => p.id))
      return [...mapped.filter(p => !ids.has(p.id)), ...prev]
    })
  }, [])

  async function handleLike(postId: string, liked: boolean) {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, user_liked: !liked, like_count: liked ? p.like_count - 1 : p.like_count + 1 }
      : p
    ))
  }

  async function handlePost() {
    if (!content.trim()) return
    setPosting(true)
    const session = getSession()
    const story: ClubStory = {
      id: `story_${Date.now()}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      authorName: session?.fullName || 'You',
    }
    addClubStory(story)
    setPosts(prev => [storyToPost(story), ...prev])
    setContent('')
    setCreating(false)
    setPosting(false)
    void currentUserId
  }

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 10 }}>Wave 16</div>
      <KudosBoard />

      {creating ? (
        <div className="surface" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>New update</div>
            <button onClick={() => setCreating(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          <textarea
            className="grc-input"
            placeholder="Share a recap, notice, or shoutout..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            style={{ resize: 'none', marginBottom: 12 }}
            autoFocus
          />
          <button className="btn-primary" onClick={handlePost} disabled={posting || !content.trim()}>
            {posting ? <Loader2 size={14} /> : null}
            {posting ? 'Posting...' : 'Publish'}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="surface"
          style={{
            width: '100%', padding: 14, marginBottom: 14, cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font)',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={18} color="var(--muted)" />
          </div>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>Share something with the club...</span>
        </button>
      )}

      {posts.map((post: any) => {
        const profile = post.profiles
        const tierColor = getTierColor(profile?.membership_tier || 'member')
        const initials = getInitials(profile?.full_name || 'GRC')
        const isOfficial = profile?.role === 'admin' || profile?.role === 'super_admin'

        return (
          <article key={post.id} className="surface" style={{ padding: 16, marginBottom: 10 }}>
            {post.is_pinned && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8A6A00', fontWeight: 700, marginBottom: 10 }}>
                <Pin size={12} /> Pinned
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: isOfficial ? 'var(--club-soft)' : `${tierColor}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: isOfficial ? '#8A6A00' : tierColor,
              }}>
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{profile?.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{formatTimeAgo(post.created_at)}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px' }}>{post.content}</p>
            <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <button onClick={() => handleLike(post.id, post.user_liked)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: post.user_liked ? '#8A6A00' : 'var(--muted)', fontSize: 13, fontFamily: 'var(--font)' }}>
                <Heart size={15} fill={post.user_liked ? 'var(--club)' : 'none'} /> {post.like_count}
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: 13 }}>
                <MessageCircle size={15} /> {post.comment_count}
              </span>
              <button
                onClick={() => navigator.share?.({ title: 'GRC', text: post.content.slice(0, 100) }).catch(() => {})}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <Share2 size={15} />
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function storyToPost(story: ClubStory) {
  return {
    id: story.id,
    content: story.content,
    post_type: story.rideTitle ? 'ride_recap' : 'general',
    is_pinned: false,
    like_count: 0,
    comment_count: 0,
    created_at: story.createdAt,
    user_liked: false,
    profiles: {
      full_name: story.authorName,
      membership_tier: 'member',
      role: 'member',
      is_elite_team: false,
    },
  }
}
