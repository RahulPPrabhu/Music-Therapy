const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = Router();

router.post('/register', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let dob = req.body.dob;
    let occupation = req.body.occupation;
    let gender = req.body.gender;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const record = await User.findOne({ email: email });

    if (record) {
        return res.status(400).send({
            message: "Email already registered"
        })
    }

    else {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            dob: dob,
            occupation: occupation,
            gender: gender
        });

        const result = await user.save();

        const {_id} = await result.toJSON();
        const token = jwt.sign({_id:_id}, "secret");
        res.cookie("jwt", token, {
            httpOnly:true,
            maxAge: 24*60*60*1000 // Session active for one day
        });

        res.send({
            message: "Success"
        })
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({email:req.body.email})
    if(!user) {
        return res.status(404).send({
            message: "User not Found"
        });
    }

    if(!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).send({
            message: 'Password is Incorrect'
        })
    }

    const token = jwt.sign({_id:user._id}, "secret")
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Session active for 1 day
    })

    res.send({
        message: "Success"
    })
});


router.get('/user',async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, "secret");

        if(!claims) {
            return res.status(401).send({
                message: "Unauthenticated User"
            })
        }

        const user = await User.findOne({_id:claims._id})

        const {password,...data} = await user.toJSON();
        res.send(data);
    }catch(err) {
        return res.status(401).send({
            message: 'Unautheticated User'
        });
    }
});

router.post('/logout', (req, res) => {
    res.cookie("jwt","",{maxAge:0})

    res.send({
        message: "Success"
    })
})

module.exports = router
