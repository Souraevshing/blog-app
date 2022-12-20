import axios from 'axios'
import React, { useState } from 'react'

import { useUser } from '../hooks/useUser'

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const { user } = useUser()

  const addComment = async () => {
    const token = user && (await user.getIdToken())

    const headers = token ? { authtoken: token } : {}

    const response = await axios.post(
      `/api/articles/${articleName}/comments`,
      {
        postedBy: name,
        text: comment,
      },
      { headers }
    )
    const updatedArticle = response.data
    onArticleUpdated(updatedArticle)
    setComment('')
    setName('')
  }

  return (
    <div id='add-comment-form'>
      <h3>Add Comments</h3>
      {user && (
        <p>
          Hello,
          <span
            style={{
              fontWeight: '700',
              letterSpacing: '.2px',
              color: 'rgb(83,140,230)',
              fontStyle: 'oblique',
              fontFamily: 'Nunito Sans',
            }}
          >
            {' '}
            {user.email}
          </span>
        </p>
      )}{' '}
      <br />
      <textarea
        name=''
        id=''
        cols='30'
        rows='5'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button onClick={addComment}>Add Comment</button>
    </div>
  )
}

export default AddCommentForm
