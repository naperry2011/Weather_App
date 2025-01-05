'use client'

import React, { useState, useEffect } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"

interface Post {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
  image_url?: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    // Set up real-time subscription
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, 
        () => {
          fetchPosts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div className="home p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Home Feed</h1>
      <div className="max-w-2xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4"
          >
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post"
                className="w-full h-64 object-cover rounded-lg mb-2"
              />
            )}
            <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
