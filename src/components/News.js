// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Loader from './Loader';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

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
        loading: true,
        page: 1,
        totalResults: 0
    };
    document.title = `${this.capitalizeWord(this.props.category)}-NewsSensei`;
}

capitalizeWord = (string) => {
    return string.charAt(0).toUpperCase()+string.slice(1);
}

fetchMoreData = async () => {
    console.log("fetchMoreData");
    await this.setState({
        page: this.state.page+1
    })
    let apiEndpoint = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}&page=${this.state.page}`;
    let data = await fetch(apiEndpoint);
    let parsedData = await data.json();
    await this.setState({
        articles: this.state.articles.concat(parsedData.articles)
    })
    // console.log(this.state.articles.length);
};

updateNews = async () => {
    this.props.setProgress(10);
    console.log("updateNews");
    let apiEndpoint = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}&page=${this.state.page}`;
    await this.setState({
        loading: true
    })
    let data = await fetch(apiEndpoint);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(50);
    await this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
    });
    this.props.setProgress(100);
}

async componentDidMount(){
    await this.updateNews();
}

// handleNextClick = async ()=>{
//     this.setState({
//         page: this.state.page+1
//     },()=>{this.updateNews()});
// }

// handlePrevClick = async ()=>{
//     await this.setState({
//         page: this.state.page-1
//     });
//     this.updateNews();
// }

render() {
    return (
      <>
      <h1 className="text-center">NewsSensei - Top {this.capitalizeWord(this.props.category)} Headlines</h1>
        {this.state.loading && <Loader></Loader>}         
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length<this.state.totalResults}
          loader={<Loader/>}
        >
        <div className="container my-5">
        <div className="row my-5">
        {this.state.articles.map((element)=>{
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
}
