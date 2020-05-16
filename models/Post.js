// models/Post.js

const mongoose = require('mongoose');

// schema
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

// model & export
const Post = mongoose.model('post', postSchema);
module.exports = Post;

/*
    1. Post의 schema는 title, body, createdAt, updatedAt 으로 구성되어 있다
    2. default 항목으로 기본 값을 지정할 수 있다.
        함수 명을 넣으면 해당 함수의 return이 기본값이 된다
        (Date.now는 현재 시간을 리턴하는 함수)

*/