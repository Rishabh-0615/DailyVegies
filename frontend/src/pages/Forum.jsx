import React, { useState, useEffect } from 'react';
import { Leaf, MessageSquare, ThumbsUp, Send, User, Calendar, ChevronDown, Search, PlusCircle, Filter, X } from 'lucide-react';

const FarmerForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forum/all');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch(`/api/forum/like/${postId}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Refresh the posts to get updated like status
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!newComment.trim()) return;
    
    try {
      await fetch(`/api/forum/comment/${postId}`, { 
        method: 'POST',
        body: JSON.stringify({ comment: newComment }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Refresh to get the new comment
      fetchPosts();
      setNewComment('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    try {
      await fetch('/api/forum/create', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Reset form and close modal
      setNewPost({ title: '', content: '' });
      setShowPostModal(false);
      
      // Refresh posts to include the new one
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-xl text-green-800">Loading community forum...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-800 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf size={28} className="text-green-200" />
              <h1 className="text-2xl font-bold">Farmer's Community Forum</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-3 text-green-300" />
                <input 
                  type="text" 
                  placeholder="Search posts..." 
                  className="bg-green-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-300"
                />
              </div>
              <button 
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md transition"
                onClick={() => setShowPostModal(true)}
              >
                <PlusCircle size={18} />
                <span>New Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-200">
          <h2 className="text-xl font-semibold text-green-800">Recent Discussions</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-green-700" />
            <select className="bg-white border border-green-300 rounded-md py-1 px-3 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Latest Posts</option>
              <option>Most Commented</option>
              <option>Most Liked</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
              {/* Post Header */}
              <div className="p-4 bg-green-50 border-b border-green-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-green-900">{post.title}</h3>
                  <div className="flex items-center text-xs text-green-600">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-green-700">
                  <User size={14} className="mr-1" />
                  <span>{post.farmer.name}</span>
                </div>
              </div>
              
              {/* Post Content */}
              <div className="p-4 text-gray-700">
                <p>{post.content}</p>
              </div>
              
              {/* Post Footer */}
              <div className="flex items-center justify-between p-4 bg-green-50 border-t border-green-100">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-1 text-green-700 hover:text-green-500"
                  >
                    <ThumbsUp size={18} />
                    <span>{post.likes.length}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedPost(post._id);
                      setShowCommentForm(!showCommentForm || selectedPost !== post._id);
                    }}
                    className="flex items-center space-x-1 text-green-700 hover:text-green-500"
                  >
                    <MessageSquare size={18} />
                    <span>{post.comments.length}</span>
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedPost(selectedPost === post._id ? null : post._id)}
                  className="text-sm text-green-600 hover:underline flex items-center"
                >
                  {post.comments.length > 0 ? (
                    <>
                      <span>{selectedPost === post._id ? 'Hide' : 'Show'} comments</span>
                      <ChevronDown size={16} className={`ml-1 transform ${selectedPost === post._id ? 'rotate-180' : ''} transition-transform`} />
                    </>
                  ) : (
                    <span>No comments yet</span>
                  )}
                </button>
              </div>
              
              {/* Comment Form */}
              {showCommentForm && selectedPost === post._id && (
                <div className="p-4 bg-green-50 border-t border-green-100">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your comment..."
                      className="flex-grow p-2 border border-green-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-r-md transition"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Comments Section */}
              {selectedPost === post._id && post.comments.length > 0 && (
                <div className="border-t border-green-100">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="p-4 border-b border-green-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center mb-2">
                          <User size={16} className="text-green-700 mr-2" />
                          <span className="font-medium text-green-800">{comment.user.name}</span>
                        </div>
                        <span className="text-xs text-green-600">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 ml-6">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800 flex items-center">
                <Leaf size={24} className="text-green-600 mr-2" />
                Create New Post
              </h2>
              <button 
                onClick={() => setShowPostModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-green-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="What's your topic about?"
                  className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-green-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your farming knowledge, questions, or experiences..."
                  rows={6}
                  className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 flex items-center"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerForum;