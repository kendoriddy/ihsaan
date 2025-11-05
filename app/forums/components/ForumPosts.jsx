'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  User,
  Reply,
  Send
} from 'lucide-react'
import { useFetch, usePost } from '@/hooks/useHttp/useHttp'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { toast } from 'react-toastify'

const ForumPosts = ({ forumId, forumTitle, onBack }) => {
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [selectedCommentId, setSelectedCommentId] = useState(null)

  const { isLoading, data, refetch } = useFetch(
    ['forum-comments', forumId],
    `https://api.ihsaanacademia.com/forum/forums/${forumId}/comments/`
  )

  const comments = data?.data?.results || []

  const { mutate: submitComment } = usePost(
    `https://api.ihsaanacademia.com/forum/forums/${forumId}/comments/`
  )

  const { mutate: submitReply } = usePost(
    selectedCommentId
      ? `https://api.ihsaanacademia.com/forum/forums/${forumId}/comments/${selectedCommentId}/replies/`
      : null
  )

  const handleCommentSubmit = () => {
    if (!replyContent.trim()) return

    const payload = { content: replyContent }

    submitComment(payload, {
      onSuccess: () => {
        toast.success('Comment posted!')
        setReplyingTo(null)
        setReplyContent('')
        refetch()
      },
      onError: () => {
        toast.error('Failed to post comment')
      }
    })
  }

  const handleReplySubmit = commentId => {
    if (!replyContent.trim()) return

    const payload = { content: replyContent }
    setSelectedCommentId(commentId)

    submitReply(payload, {
      onSuccess: () => {
        toast.success('Reply posted!')
        setReplyingTo(null)
        setReplyContent('')
        refetch()
      },
      onError: () => {
        toast.error('Failed to post reply')
      }
    })
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

        {isLoading ? (
          <div className='text-center py-20 text-gray-500'>
            Loading comments...
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Add New Comment Section */}
            <div className='text-center'>
              <Button
                onClick={() => setReplyingTo('new')}
                className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg mb-4'
              >
                Add New Comment
              </Button>

              {replyingTo === 'new' && (
                <div className='mt-4 max-w-xl mx-auto'>
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder='Write your comment...'
                    className='w-full border border-gray-300 rounded-lg p-3'
                    rows={4}
                  />
                  <div className='flex items-center justify-center space-x-2 mt-3'>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!replyContent.trim()}
                    >
                      <Send className='w-4 h-4 mr-1' /> Post Comment
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              comments.map(post => (
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
                          {post.author.first_name}
                        </h3>
                        <div className='flex items-center space-x-1 text-sm text-gray-500'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            {new Date(post.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className='text-gray-700 mb-4 leading-relaxed'>
                        {post.content}
                      </p>

                      <div className='flex items-center space-x-6 text-sm text-gray-500'>
                        <button
                          onClick={() => setReplyingTo(post.id)}
                          className='flex items-center space-x-1 hover:text-blue-600 transition-colors'
                        >
                          <Reply className='w-4 h-4' />
                          <span>Reply ({post.reply_count})</span>
                        </button>
                      </div>

                      {post.replies?.length > 0 && (
                        <div className='mt-4 pl-6 border-l-2 border-gray-200 space-y-3'>
                          {post.replies.map(reply => (
                            <div
                              key={reply.id}
                              className='bg-gray-50 rounded-lg p-4'
                            >
                              <div className='flex items-center space-x-2 mb-1'>
                                <h4 className='font-medium text-gray-800'>
                                  {reply.author.first_name}
                                </h4>
                                <span className='text-sm text-gray-500'>
                                  {new Date(reply.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className='text-gray-700'>{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {replyingTo === post.id && (
                        <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                          <h4 className='text-sm font-medium text-gray-900 mb-2'>
                            Reply to this post
                          </h4>
                          <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder='Write your reply...'
                            className='w-full border border-gray-300 rounded-lg p-3 mb-3'
                            rows={3}
                          />
                          <div className='flex space-x-2'>
                            <Button
                              onClick={() => handleReplySubmit(post.id)}
                              disabled={!replyContent.trim()}
                            >
                              <Send className='w-4 h-4 mr-1' /> Send Reply
                            </Button>
                            <Button
                              variant='outlined'
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-12'>
                <MessageSquare className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No comments yet
                </h3>
                <p className='text-gray-600 mb-4'>
                  Be the first to start the discussion!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ForumPosts
