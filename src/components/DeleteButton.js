import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Button, Confirm, Icon } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../utils/graphql'
import MyPopup from '../utils/MyPopup'

function DeleteButton({postId, commentId, callback}) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation (mutation, {
        refetchQueries: [{ query: FETCH_POSTS_QUERY }],
        update(proxy){
            setConfirmOpen(false);

            if(callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })




    return (
        <>
        <MyPopup content = {commentId ? 'Delete Comment' : 'Delete Post'}>
            <Button 
                as='div' 
                floated='right' 
                color='red' 
                size='small' 
                onClick={() => setConfirmOpen(true)}
            >
                <Icon name='trash alternate' style={{width: 2}} />
            </Button>
        </MyPopup>
        
        <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm = {deletePostOrMutation}
        />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql `
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

export default DeleteButton