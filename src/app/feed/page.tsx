import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Feed() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={session.user.user_metadata.avatar_url} 
            alt="Profile" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">
              Welcome, {session.user.user_metadata.full_name}!
            </h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                Create New Post
              </button>
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                View Profile
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
            <p className="text-gray-600">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 