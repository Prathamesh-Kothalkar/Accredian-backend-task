const express = require("express");
const jwt=require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { userBody, userSigninBody, referralBody } = require("../validation/valid");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware/authMiddleware");
const sendRefer = require("../sendEmail");
const prisma = new PrismaClient();
const userRouter = express.Router();


userRouter.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.json({
            users: users
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error", });
    }
})

userRouter.delete("/", async (req, res) => {
    try {
        const users = await prisma.user.deleteMany();
        return res.json({
            msg: "Deleted All"
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error", });
    }
})

userRouter.post("/create", async (req, res) => {
    const { success } = userBody.safeParse(req.body);
    if (!success) {
        return res.status(402).json({
            msg: "Invalid Data"
        })
    }

    const { name, email, password } = req.body;
    try {

        const isUser = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if(isUser){
            return res.status(403).json({
                msg:"Email already used"
            })
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })
        const token = jwt.sign({userId:user.id.toString()},JWT_SECRET)
        res.status(201).json({
            msg:"User created sucessfully",
            token:token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create user", });
    }
});

userRouter.post("/signin", async (req, res) => {
    const {success} = userSigninBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"Invalid Data"
        })
    }
    const {email,password}=req.body;
    try{
        const user = await prisma.user.findFirst({
            where:{
                AND:[
                    {email:email},
                    {password:password}
                ]
            }
        })

        if(!user){
            return res.status(404).json({
                msg:"User not found"
            })
        }
        const token = jwt.sign({ userId: user.id.toString() }, JWT_SECRET);

        res.status(201).json({
            msg:"User Login sucessfully",
            token:token
        })
    }
    catch(err){
        console.log(err)
    }
   
})


userRouter.post("/refer", authMiddleware, async (req, res) => {
    const { success } = referralBody.safeParse(req.body);
    if (!success) {
        return res.status(402).json({
            msg: "Invalid Data"
        });
    }

    const { refereeName, refereeEmail, course } = req.body;
    const referrerId = parseInt(req.userId, 10); // Convert userId to integer

    try {
        const referrer = await prisma.user.findUnique({
            where: { id: referrerId }
        });

        if (!referrer) {
            return res.status(404).json({ msg: "Referrer not found" });
        }

        const refer = await prisma.referral.create({
            data: {
                referrerId: referrerId,
                refereeName: refereeName,
                refereeEmail: refereeEmail,
                course: course
            }
        });

        const emailText = `Hi ${refereeName},\n\n${referrer.name} has referred you to join the course: ${course}.`;

        await sendRefer(refereeEmail, emailText);

        res.status(201).json({
            msg: "Referral created successfully",
            referral: refer
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creating referral" });
    }
});

module.exports = userRouter;