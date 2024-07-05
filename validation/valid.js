const zod =require("zod")

const userBody=zod.object({
    name:zod.string().min(3),
    email:zod.string().email(),
    password:zod.string().min(6)
})

const userSigninBody=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6)
})

const referralBody = zod.object({
    refereeName: zod.string().min(1),
    refereeEmail: zod.string().email(),
    course: zod.string().min(1)
});

module.exports={userBody,userSigninBody,referralBody}