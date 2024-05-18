const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const User = require('../models/user');
const Disorder = require('../models/disorder');
const nodemailer = require('nodemailer');
const therapist = require('../models/therapist');
const router = Router();
router.use(cookieParser())

// Registration
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

        const { _id } = await result.toJSON();
        const token = jwt.sign({ _id: _id }, "secret");
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.send({
            message: "Success"
        })
    }
});

// Login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send({
            message: "User not Found"
        });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).send({
            message: 'Password is Incorrect'
        })
    }

    // Include user's email in the JWT payload
    const token = jwt.sign({ _id: user._id, email: user.email }, "secret")
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'None',
        httpOnly: true,
        secure: true
    })
    res.send({
        message: "Success"
    })
});


// User Route
router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, "secret");

        if (!claims) {
            return res.status(401).send({
                message: "Unauthenticated User"
            })
        }

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON();
        res.send(data);
    } catch (err) {
        return res.status(401).send({
            message: 'Unautheticated User'
        });
    }
});

router.post('/storeDisorder', async (req, res) => {
    const email = req.body.email;
    const disorder = req.body.disorder;

    // Create a new document and save it to the database
    const disorderDocument = new Disorder({ email, disorder });
    await disorderDocument.save();

    res.status(200).send({
        message: "Disorder stored successfully"
    });
});

// Getting Cookies Value i.e jwt value
router.get('/userDetails', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, "secret");

        if (!claims) {
            return res.status(401).send({
                message: "Unauthenticated User"
            })
        }

        const user = await User.findOne({ _id: claims._id });

        if (!user) {
            return res.status(401).send({
                message: "User not found"
            })
        }

        const { password, ...data } = await user.toJSON();
        res.send({ 'email': data.email, 'name': data.name });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Internal Server Error'
        });
    }
});

router.get('/disorder', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, "secret");

        const userEmail = decodedToken.email;

        const disorders = await Disorder.find({ email: userEmail });

        if (!disorders) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send(disorders)
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve disorders' });
    }
});

router.post('/sendEmail', async (req, res) => {
    const { email, hour, minute, ampm, date } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aitherapy.music@gmail.com',
            pass: 'tbpv ycsv dtod aiaf'
        }
    });

    let mailOptions = {
        from: 'aitherapy.music@gmail.com',
        to: email,
        subject: 'Therapy Schedule',
        html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Therapy Schedule</title>
                </head>
                <body>
                    <div class="mail" style="background-color: black; text-align: center;">
                        <h1 style="color: red;">Welcome to Music Therapy</h1>
                        <h2 style="color: white;">Hello,</h2>
                        <h4 style="color: white;">Your Therapy is schedule at ${hour}:${minute} ${ampm} on ${date}.</h4>
                        <h4 style="color: white;">Thank You for Choosing Music Therapy</h4>
                        <h4 style="color: white;">Music Therapy wishes you good health</h4>
                    </div>
                </body>
                </html>
            `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({message: 'Email sent successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error sending email.'});
    }
});

router.post('/confirmAppointment', async (req, res) => {
    const { email, name, date } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aitherapy.music@gmail.com',
            pass: 'tbpv ycsv dtod aiaf'
        }
    });

    let mailOptions = {
        from: 'aitherapy.music@gmail.com',
        to: email,
        subject: 'Therapy Schedule',
        html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Therapy Schedule</title>
                </head>
                <body>
                    <div class="mail" style="background-color: black; text-align: center;">
                        <h1 style="color: red;">Welcome to Music Therapy</h1>
                        <h2 style="color: white;">Hello,</h2>
                        <h4 style="color: white;">Your Appointment with ${name} is schedule at 5-7PM on ${date}</h4>
                        <h4 style="color: white;">Thank You for Choosing Music Therapy</h4>
                        <h4 style="color: white;">Music Therapy wishes you good health</h4>
                    </div>
                </body>
                </html>
            `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({message: 'Email sent successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error sending email.'});
    }
});

router.post('/therapist', async(req, res) => {
    const { therapistName, status, email} = req.body;
    const therapistDocument = new therapist({ therapistName, status, email});
    try {
        await therapistDocument.save();
        res.send("Appointment Successful");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving the document');
    }
});


router.get('/therapistStatus', async (req, res) => {
    try {
      const therapists = await therapist.find({}, 'therapistName status specialization');
      res.json(therapists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});

router.put('/therapistStatus/:therapistName', async (req, res) => {
    console.log(req.body)
    try {
      const therapistData = await therapist.findOneAndUpdate({ therapistName: req.params.therapistName }, req.body, { new: true });
      console.log(req.params.therapistName)
      res.json(therapistData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

router.post('/logout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 })

    res.send({
        message: "Success"
    })
})

module.exports = router