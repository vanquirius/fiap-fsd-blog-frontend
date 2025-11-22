const { rest } = require("msw");

const handlers = [
    //
    // --- POSTS LIST ---
    //
    rest.get("http://localhost:8080/posts", (req, res, ctx) => {
        return res(
            ctx.json([
                { _id: "1", title: "Test Post", author: "Teacher", content: "Hello" }
            ])
        );
    }),

    // Support relative URL: /posts
    rest.get("/posts", (req, res, ctx) => {
        return res(
            ctx.json([
                { _id: "1", title: "Test Post", author: "Teacher", content: "Hello" }
            ])
        );
    }),

    //
    // --- GET SINGLE POST ---
    //
    rest.get("http://localhost:8080/posts/:id", (req, res, ctx) => {
        return res(
            ctx.json({
                _id: req.params.id,
                title: "Post Title",
                content: "Post content",
                author: "Teacher"
            })
        );
    }),

    // Support relative URL: /posts/:id
    rest.get("/posts/:id", (req, res, ctx) => {
        return res(
            ctx.json({
                _id: req.params.id,
                title: "Post Title",
                content: "Post content",
                author: "Teacher"
            })
        );
    }),

    //
    // --- GET COMMENTS ---
    //
    rest.get("http://localhost:8080/posts/:id/comments", (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    _id: "c1",
                    author: "User 123",
                    text: "Nice!",
                    createdAt: new Date().toISOString()
                }
            ])
        );
    }),

    // Support relative URL: /posts/:id/comments
    rest.get("/posts/:id/comments", (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    _id: "c1",
                    author: "User 123",
                    text: "Nice!",
                    createdAt: new Date().toISOString()
                }
            ])
        );
    }),

    //
    // --- POST COMMENT ---
    //
    rest.post("http://localhost:8080/posts/:id/comments", async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.status(201),
            ctx.json({
                _id: "new123",
                author: body.username,
                text: body.text,
                createdAt: new Date().toISOString()
            })
        );
    }),

    // Support relative URL: /posts/:id/comments
    rest.post("/posts/:id/comments", async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.status(201),
            ctx.json({
                _id: "new123",
                author: body.username,
                text: body.text,
                createdAt: new Date().toISOString()
            })
        );
    }),

    //
    // --- LOGIN ---
    //
    rest.post("http://localhost:8080/auth/login", async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.json({
                username: body.username,
                token: "fake-jwt-token"
            })
        );
    }),

    // Relative URL support
    rest.post("/auth/login", async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.json({
                username: body.username,
                token: "fake-jwt-token"
            })
        );
    }),
];

module.exports = { handlers };