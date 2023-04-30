import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Loader from './Loader';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalResults, setTotalResults] = useState(0);


const capitalizeWord = (string) => {
    return string.charAt(0).toUpperCase()+string.slice(1);
}

const fetchMoreData = async () => {
    let apiEndpoint = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page+1}`;
    setPage(page+1);
    let data = await fetch(apiEndpoint);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
};

const updateNews = async () => {
    props.setProgress(10);
    let apiEndpoint = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page}`;
    setLoading(true);
    let data = await fetch(apiEndpoint);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(50);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
}

useEffect(() => {
    document.title = `${capitalizeWord(props.category)}-NewsSensei`;
    updateNews();
    //eslint-disable-next-line
},[]);

    return (
      <>
      <h1 className="text-center" style={{marginTop:"50px"}}>NewsSensei - Top {capitalizeWord(props.category)} Headlines</h1>
        {loading && <Loader></Loader>}         
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length<totalResults}
          loader={<Loader/>}
        >
        <div className="container my-5">
        <div className="row my-5">
        {articles.map((element)=>{
            return <div className="col-md-4" key={element.url}>
                <NewsItem title = {element.title!==null?(element.title.length>45?element.title.slice(0,45)+'...':element.title):"No title"} 
                description={element.description!==null?(element.description.length>90?element.description.slice(0,90)+'...':element.description):"No Description"} 
                imageUrl={element.urlToImage!==null?element.urlToImage:`news-reader.jpg`} 
                newsUrl={element.url}
                publishedAt={element.publishedAt}
                author={element.author}
                source={element.source.name}></NewsItem>
            </div>
        })}
        </div>
        </div>
        </InfiniteScroll>
    </>
    )
}

News.defaultProps = {
    country: 'in',
    category: 'technology',
    pageSize: 8
}
News.propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number
}

export default News;