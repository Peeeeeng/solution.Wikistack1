const express = require("express");
const router = express.Router();
const models = require("../models");
const Page = models.Page;
const User = models.User;
const { main, addPage, editPage, wikiPage } = require("../views");
const notFoundPage = require("../views/notFoundPage");

// /wiki

router.get("/", async(req, res, next) => {
    try {
        const pages = await Page.findAll();
        // console.log(pages)
        console.log("================")
        console.log("Calling main")
        console.log("================")
        res.send(main(pages));
    } catch (error) { next(error) }
});

// /wiki
router.post("/", async(req, res, next) => {
    try {
        const [user, wasCreated] = await User.findOrCreate({
            where: {
                name: req.body.name,
                email: req.body.email
            }
        });
        // console.log("================")
        // console.log("User name:" + user.name + " id:" + user.id)
        // console.log("================")
        // console.log("================")
        // console.log(req.body.title + "," + req.body.content + "," + req.body.status + "," + req.body.tags)
        // console.log("================")
        req.body.tags = req.body.tags.split(" ");
        const page = await Page.create(req.body);
        // console.log("================")
        // console.log("Waited, page is " + page)
        // console.log("================")
        const setA = await page.setAuthor(user);
        // console.log("================")
        // console.log("set author " + setA)
        // console.log("================")
        res.redirect("/wiki/" + page.slug);
    } catch (error) {
        console.log("================")
        console.log("Catch an error somewhere during create page")
        console.error(error)
        console.log("================")
        next(error)
    }
});

router.post("/:slug", async(req, res, next) => {
    try {
        const [updatedRowCount, updatedPages] = await Page.update(req.body, {
            where: {
                slug: req.params.slug
            },
            returning: true
        });

        res.redirect("/wiki/" + updatedPages[0].slug);
    } catch (error) { next(error) }
});

router.get("/:slug/delete", async(req, res, next) => {
    try {
        await Page.destroy({
            where: {
                slug: req.params.slug
            }
        });

        res.redirect("/wiki");
    } catch (error) { next(error) }
});

// /wiki/add
router.get("/add", (req, res) => {
    res.send(addPage());
});

// /wiki/(dynamic value)
router.get("/:slug", async(req, res, next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        });
        if (page === null) {
            res.status(404).send(notFoundPage())
        } else {
            const author = await page.getAuthor();
            console.log(author)
            res.send(wikiPage(page, author));
        }
    } catch (error) { next(error) }
});

router.get("/:slug/edit", async(req, res, next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        });

        if (page === null) {
            res.sendStatus(404);
        } else {
            const author = await page.getAuthor();
            res.send(editPage(page, author));
        }
    } catch (error) { next(error) }
});

router.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send(notFoundPage())
})
router.use((req, res, next) => {
    res.status(404).send("You found it!")
})

module.exports = router;