// routes/posts.js

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Index
router.get('/', (req, res) => {
    Post.find({}).sort('-createdAt').exec( (err, posts) => {
        if (err) return res.json(err);
        res.render('posts/index', { posts });
    });
    // 나중에 생성된 data가 위로 오도록 정렬. find와 function 사이에 sort함수가 들어간 형태
    // 원래 모양 : Post.find({}, (err, posts) => {})  
    // 위의 코드의 정석 표현 : Post.find({}).exec((err, posts) => {})
    // exec함수 앞에 DB에서 데이터를 어떻게 찾을지, 어떻게 정렬할지 등등을 함수로 표현하고
    // exec안의 함수에서 해당 data를 받아와서 할 일을 정하는 구조
    // .sort() 함수는 string이나 object를 받아서 데이터 정렬 방법을 정의하는데
    // 문자열의 경우 정렬할 항목명을 문자열로 넣으면 오름차순으로 정렬, 내림차순의 경우 앞에 '-'를 붙인다
    // 두 가지 이상으로 정렬하는 경우 빈칸을 넣고 각각의 항목을 적어주면 된다.
    // object의 경우 { createdAt: 1 } (오름차순), { createdAt: -1 } (내림차순)
});

// New
router.get('/new', (req, res) => {
    res.render('posts/new');
});

// create
router.post('/', (req, res) => {
    Post.create(req.body, (err, post) => {
        if (err) return res.json(err);
        res.redirect('/posts');
    });
});

// show
router.get('/:id', (req, res) => {
    Post.findOne({ _id: req.params.id}, (err, post) => {
        if (err) return res.json(err);
        res.render('posts/show', { post });
    });
});

// edit
router.get('/:id/edit', (req, res) => {
    Post.findOne({ _id: req.params.id }, (err, post) => {
        if (err) return res.json(err);
        res.render('posts/edit', { post });
    });
});

// update
router.put('/:id', (req, res) => {
    req.body.updateAt = Date.now();
    // post를 수정하는 경우 수정된 날짜를 updateAt에 기록한다.
    Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err, post) => {
        if (err) return res.json(err);
        res.redirect(`/posts/${req.params.id}`);
    });
});

// destroy
router.delete('/:id', (req, res) => {
    Post.deleteOne({ _id: req.params.id }, err => {
        if (err) return res.json(err);
        res.redirect('/posts');
    });
});

module.exports = router;

