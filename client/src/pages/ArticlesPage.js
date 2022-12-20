import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import CommentsList from '../components/CommentsList'
import AddCommentForm from '../components/AddCommentForm'
import Error from './404'
import articles from '../utils/articles'
import { useUser } from '../hooks/useUser'

const ArticlesPage = () => {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  })
  const { canUpvote } = articleInfo

  const { user, loading } = useUser()

  const { articleId } = useParams()

  const article = articles.find((article) => article.name === articleId)

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken())

      const headers = token ? { authtoken: token } : {}

      const response = await axios.get(`/api/articles/${articleId}`, {
        headers,
      })

      const newArticle = response.data

      setArticleInfo(newArticle)
    }

    if (!loading) {
      loadArticleInfo()
    }
  }, [loading, user])

  const addUpvote = async () => {
    const token = user && (await user.getIdToken())

    const headers = token ? { authtoken: token } : {}

    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    )

    const updatedArticle = response.data
    setArticleInfo(updatedArticle)
  }

  if (!article) {
    return <Error />
  }

  return (
    <>
      <h1>{article.title}</h1>
      <div className='upvotes-section'>
        {user ? (
          <button
            onClick={addUpvote}
            className={`${canUpvote === false ? 'disabled' : ''}`}
          >
            {canUpvote ? 'Vote' : 'Already Voted'}
          </button>
        ) : (
          <button>Login to Vote</button>
        )}

        <p>This article has {articleInfo.upvotes} vote(s).</p>
      </div>

      {article.content.map((p, id) => {
        return <p key={id}>{p}</p>
      })}

      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfo(updatedArticle)}
        />
      ) : (
        <button>Login to add comment</button>
      )}
      <CommentsList comments={articleInfo.comments} />
    </>
  )
}

export default ArticlesPage
