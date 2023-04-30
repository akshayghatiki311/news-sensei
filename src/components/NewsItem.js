// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from "moment";

export default class NewsItem extends Component {
  // static propTypes = {second: third}

  render() {
    let {title,description,imageUrl,newsUrl,publishedAt,author,source} = this.props;
    return (
      <div className="my-3">
        <div className="card">
        <div style={{display:"flex",justifyContent:"flex-end",position:"absolute",right:0}}>
          <span className=" badge rounded-pill bg-primary">{source}</span>
        </div>
        <img src={imageUrl} className="card-img-top" alt="..."/>
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <h6>{((new Date().getDate()-new Date(publishedAt).getDate())<2)?<span className="badge rounded-pill text-bg-danger">New</span>:''}</h6>
            <p className="card-text">{description}</p>
            <p className="card-title"><small className='text-muted'>By {author?author:"Unknown"} on {moment(publishedAt).utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')}</small></p>
            <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-sm btn-dark">Read more</a>
        </div>
        </div>
      </div>
    )
  }
}
