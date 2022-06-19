import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const graphqlQuery = {
      query: `
      query fetchSinglePost($postId:ID!){
        post(id:$postId){
          title
          content
          imageUrl
          creator{
            name
          }
          createdAt
        }
      }
      `,
      variables: {
        postId: postId,
      },
    };

    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          console.log(resData.errors);
          throw new Error("Fetching post failed.");
        }

        this.setState({
          title: resData.data.post.title,
          author: resData.data.post.creator.name,
          image: "http://localhost:8080/images/" + resData.data.post.imageUrl,
          date: new Date(resData.data.post.createdAt).toLocaleDateString(
            "en-US"
          ),
          content: resData.data.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <img src={this.state.image} width="auto" height="300px" />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
