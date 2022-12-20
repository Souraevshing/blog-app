import React from 'react'

import ArticlesList from '../components/ArticlesList'

const ArticlesPage = ({ articles }) => {
  return (
    <>
      <h1>Articles </h1>
      <ArticlesList articles={articles} />
    </>
  )
}

export default ArticlesPage
