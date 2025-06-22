import React, { useState } from 'react'
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  User,
  ThumbsUp,
  Reply,
  Send
} from 'lucide-react'
// import { Textarea } from './ui/textarea'
import Button from '@/components/Button'
import Layout from '@/components/Layout'

const ForumPosts = ({ forumId, forumTitle, onBack }) => {
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')

  const posts = [
    {
      id: '1',
      author: 'John Smith',
      content:
        'Great discussion topic! I believe the interacting elements in a society include cultural norms, social institutions, economic systems, and political structures. These elements are interconnected and influence each other in complex ways.',
      createdAt: '2024-01-20T10:30:00Z',
      likes: 5,
      replies: 2
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      content:
        'Regarding the essential elements of a contract, I think we need to consider: 1) Offer and acceptance 2) Consideration 3) Legal capacity 4) Lawful purpose. These are fundamental requirements for any valid contract.',
      createdAt: '2024-01-19T14:15:00Z',
      likes: 3,
      replies: 1
    },
    {
      id: '3',
      author: 'Michael Brown',
      content:
        'I would like to add that mutual consent is also crucial for contract formation. Both parties must agree to the terms willingly and without coercion.',
      createdAt: '2024-01-19T16:45:00Z',
      likes: 2,
      replies: 0
    },
    {
      id: '4',
      author: 'Emily Davis',
      content:
        'The social institutions mentioned by John are particularly important. They include family, education, religion, government, and economy. Each plays a vital role in shaping society.',
      createdAt: '2024-01-18T09:20:00Z',
      likes: 4,
      replies: 3
    }
  ]

  const handleReplyClick = postId => {
    setReplyingTo(replyingTo === postId ? null : postId)
    setReplyContent('')
  }

  const handleReplySubmit = postId => {
    if (replyContent.trim()) {
      console.log('Replying to post:', postId, 'with content:', replyContent)
      // send reply to the backend
      setReplyingTo(null)
      setReplyContent('')
    }
  }

  return (
    <Layout>
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={onBack}
            className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span>Back to Forums</span>
          </button>
        </div>

        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Forum Posts</h1>
          <p className='text-gray-600 mt-1'>{forumTitle}</p>
        </div>

        <div className='space-y-4'>
          {posts.map(post => (
            <div
              key={post.id}
              className='bg-white rounded-lg border border-gray-200 p-6'
            >
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <User className='w-5 h-5 text-blue-600' />
                  </div>
                </div>

                <div className='flex-1'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <h3 className='font-semibold text-gray-900'>
                      {post.author}
                    </h3>
                    <div className='flex items-center space-x-1 text-sm text-gray-500'>
                      <Calendar className='w-4 h-4' />
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className='text-gray-700 mb-4 leading-relaxed'>
                    {post.content}
                  </p>

                  <div className='flex items-center space-x-6 text-sm text-gray-500'>
                    <button className='flex items-center space-x-1 hover:text-blue-600 transition-colors'>
                      <ThumbsUp className='w-4 h-4' />
                      <span>{post.likes} likes</span>
                    </button>
                    <button
                      onClick={() => handleReplyClick(post.id)}
                      className='flex items-center space-x-1 hover:text-blue-600 transition-colors'
                    >
                      <Reply className='w-4 h-4' />
                      <span>{post.replies} replies</span>
                    </button>
                  </div>

                  {replyingTo === post.id && (
                    <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                      <h4 className='text-sm font-medium text-gray-900 mb-2'>
                        Reply to this post
                      </h4>
                      <textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder='Write your reply...'
                        className='mb-3'
                        rows={3}
                      />
                      <div className='flex items-center space-x-2'>
                        <Button
                          onClick={() => handleReplySubmit(post.id)}
                          size='sm'
                          disabled={!replyContent.trim()}
                        >
                          <Send className='w-4 h-4 mr-1' />
                          Send Reply
                        </Button>
                        <Button
                          onClick={() => setReplyingTo(null)}
                          variant='outline'
                          size='sm'
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className='text-center py-12'>
            <MessageSquare className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No posts yet
            </h3>
            <p className='text-gray-600'>
              Be the first to start the discussion!
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ForumPosts
