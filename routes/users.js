const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require("../Models/User")

//Update User
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)

            } catch (err) {
                return res.status(500).json(err)
            }

        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been Updated")
        } catch (err) {
            return res.status(500).json(err)
        }

    }
    else {
        return res.status(500).json("You can Update Only Your Account!")
    }

})

//Delete user

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been Deleted Successfully")
        } catch (err) {
            return res.status(500).json(err)
        }

    }
    else {
        return res.status(500).json("You can Delete Only Your Account!")
    }

})

//get One

router.get('/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...others } = user._doc
        res.status(200).json(others);

    } catch (err) {
        return res.status(500).json(err);

    }
})

//follow users

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentId = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentId.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("You already followed id user")
            }

        } catch (err) {
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't followed yourself")
    }

})
//unfollow  users


router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentId = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentId.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("You don't followed id user")
            }

        } catch (err) {
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't unfollowed yourself")
    }

})


module.exports = router;