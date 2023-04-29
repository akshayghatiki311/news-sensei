// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Loader from './Loader';
import PropTypes from 'prop-types'

export default class News extends Component {
    static defaultProps = {
        country: 'in',
        category: 'technology',
        pageSize: 8
    }
    static propTypes = {
        country: PropTypes.string,
        category: PropTypes.string,
        pageSize: PropTypes.number
    }
  constructor(props){
    super(props);
    this.state = {
        articles: [],
        loading: false,
        page: 1
    };
    document.title = `${this.capitalizeWord(this.props.category)}-NewsSensei`;
}

capitalizeWord = (string) => {
    return string.charAt(0).toUpperCase()+string.slice(1);
}

updateNews = async () => {
    let apiEndpoint = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=748eb03f4830456ea48b83b86cbac8f5&pageSize=${this.props.pageSize}&page=${this.state.page}`;
    this.setState({
        loading: true
    })
    let data = await fetch(apiEndpoint);
    let parsedData = await data.json();
    this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
    })
}

async componentDidMount(){
    this.updateNews();
}

handleNextClick = async ()=>{
    this.setState({
        page: this.state.page+1
    },()=>{this.updateNews()});
}

handlePrevClick = async ()=>{
    await this.setState({
        page: this.state.page-1
    });
    this.updateNews();
}

render() {
    return (
      <div className="container my-5">
      <h1 className="text-center">NewsSensei - Top {this.capitalizeWord(this.props.category)} Headlines</h1>
      {this.state.loading && <Loader></Loader>}   
        <div className="row my-5">
        {!this.state.loading && this.state.articles.map((element)=>{
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
        <div className="container d-flex justify-content-between">
            <button type="button" disabled = {this.state.page===1?true:false} className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
            <button type="button" disabled = {this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}
