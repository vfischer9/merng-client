import React, { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button, Card, Form, Grid, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton';

import MyPopup from '../utils/MyPopup'

function SinglePost(props) {
   const postId = props.match.params.postId;
   const { user } = useContext(AuthContext);

   const commentInputRef = useRef(null);

    console.log(postId);

    const [comment, setComment] = useState('');

    const {data: {getPost} = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
      update(){
        setComment('');
        commentInputRef.current.blur();
      },
      variables: {
        postId,
        body: comment
      }
    })

    function deletePostCallback(){
      props.history.push('/')
    }

   let postMarkup;
   if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = getPost;

   postMarkup = (
       <Grid>
           <Grid.Row>
               <Grid.Column width={2}>
                    <Image
                    src='https://lh3.googleusercontent.com/proxy/M0Pmt2r3Xdrq_oX9v-zBsGQX-Hs-sXmWxkkjp9Y8fwKN-0i5E2OkNOfusgluktuTn1VK6jA2iNsZO8bFxGI-b9yxG9duQIBU9Q'
                    size='small'
                    float='right'
                    />
               </Grid.Column>

               <Grid.Column width={10}>
                   <Card fluid>
                       <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                       </Card.Content>
                       <hr />
                       <Card.Content extra>
                            <LikeButton user = {user} post={{id, likeCount, likes}} style={{width: 2}}/>
                            <MyPopup content='Leave a Comment'>
                                <Button
                                  as="div"
                                  labelPosition="right"
                                  onClick={() => console.log('Comment on post')}
                                  >
                                  <Button basic color="teal">
                                      <Icon name="comment alternate" style={{width: 2}} />
                                  </Button>
                                  <Label color="teal">
                                  {commentCount}
                                  </Label>
                              </Button>
                            </MyPopup>

                            {user && user.username === username && (
                                <DeleteButton postId= {id} callback={deletePostCallback}/>
                            )}
                       </Card.Content>
                   </Card>
                    
                    {user && (
                      <Card fluid>
                          <h5 style={{marginLeft: 11, marginTop: 15}}>Leave a Comment</h5>
                          <Form className='commentArea'>
                              <div className='ui action input fluid'>
                                <input
                                type='text'
                                placeholder='Comment...'
                                name='comment'
                                value={comment}
                                onChange={event => setComment(event.target.value)}
                                ref={commentInputRef}
                                />
                                <Button 
                                type='submit'
                                className='ui button teal'
                                disabled={comment.trim() === ''}
                                onClick={submitComment}
                                >
                                Post
                                </Button>
                              </div>
                          </Form>
                      </Card>
                    )}

                   {comments.map((comment) => (
                        <Card fluid key={comment.id}>
                        <Card.Content>
                          {user && user.username === comment.username && (
                            <DeleteButton postId = {id} commentId = {comment.id} />
                          )}
                            <Card.Header>{comment.username}</Card.Header>
                            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{comment.body}</Card.Description>
                          </Card.Content>
                        </Card>
                    ))}
                    

               </Grid.Column>

           </Grid.Row>
       </Grid>
   )
}

   return postMarkup;

}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql `
  mutation($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id body createdAt username
      }
      commentCount
    }
  }
`

export default SinglePost