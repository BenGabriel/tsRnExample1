import { post, User, comment } from "./types";

const Users: User[] = [
    {
        id: 1,
        name: 'Ben Gabriel',
        avatar: 'https://cdn4.vectorstock.com/i/thumb-large/78/38/avatar-men-design-vector-14527838.jpg'
    },
    {
        id: 2,
        name: 'Tommy Shelby',
        avatar: 'https://cdn4.vectorstock.com/i/thumb-large/78/38/avatar-men-design-vector-14527838.jpg'
    },
    {
        id: 3,
        name: 'John Doe',
        avatar: 'https://cdn4.vectorstock.com/i/thumb-large/78/38/avatar-men-design-vector-14527838.jpg'
    },
]

const posts: post[] = [
    {
        id: 1,
        likes: [],
        author: 1,
        text: 'This is a text',
        comments: [],
        timeStamp: Date.now(),
        // authorDetails: {
        //     id: 1,
        //     name: 'Ben',
        //     avatar : ''
        // }
    },
    {
        id: 2,
        likes: [],
        author: 2,
        text: 'This is a very cool text',
        comments: [],
        timeStamp: Date.now(),
    },
    {
        id: 3,
        likes: [],
        author: 3,
        text: 'This is an amazing post you will like',
        comments: [],
        timeStamp: Date.now(),
    },
    {
        id: 4,
        likes: [],
        author: 1,
        text: 'simply the best post online',
        comments: [],
        timeStamp: Date.now(),
    },
    {
        id: 5,
        likes: [],
        author: 2,
        text: 'great Post for all',
        comments: [],
        timeStamp: Date.now(),
    }
]
export { Users, posts }