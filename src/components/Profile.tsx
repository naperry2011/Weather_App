'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  content: string
  image_url?: string
  created_at: string
  user_id: string
}

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data: userPosts, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPosts(userPosts || [])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    // Set up real-time subscription
    const channel = supabase
      .channel('user_posts')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts',
          filter: `user_id=eq.${supabase.auth.user()?.id}`
        }, 
        () => {
          fetchUserData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h2>
            <button
              onClick={handleSignOut}
              className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">My Posts</h3>
            {posts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
