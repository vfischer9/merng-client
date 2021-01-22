import React, { useContext } from 'react'
import { Button, Card, Container, Icon, Label, Image, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'

import DeleteButton from './DeleteButton'
import MyPopup from '../utils/MyPopup'

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }}) {
    

    const { user } = useContext(AuthContext);

    return (
        <Card fluid >
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://lh3.googleusercontent.com/proxy/M0Pmt2r3Xdrq_oX9v-zBsGQX-Hs-sXmWxkkjp9Y8fwKN-0i5E2OkNOfusgluktuTn1VK6jA2iNsZO8bFxGI-b9yxG9duQIBU9Q'
                />
                <Container as={Link} to={`/posts/${id}`}>
                    <Card.Header className='header' style={{color: 'black'}}>{username}</Card.Header>
                    <Card.Meta >{moment(createdAt).fromNow()}</Card.Meta>
                    <Card.Description style={{color: 'black'}}>{body}</Card.Description>
                </Container>
            </Card.Content>
            <Card.Content extra>
               
                <LikeButton user={user} post={{ id, likes, likeCount}}/>

                <MyPopup content='Leave a Comment'>
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='teal' basic>
                            <Icon name='comment alternate' style={{width: 2}} />
                        </Button>
                        <Label color='teal'>
                             {commentCount}
                        </Label>
                     </Button>
                </MyPopup>
                        
                {user && user.username === username && <DeleteButton postId = {id} />}

            </Card.Content>
        </Card>
    )
}

export default PostCard
