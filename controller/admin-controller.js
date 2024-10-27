require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

module.exports = {

    loginAdmin: async (req, res) => {
        try {
            // Ambil email dan password dari body
            const { email, password } = req.body;

            // Cari admin berdasarkan email
            const admin = await prisma.admin.findUnique({
                where: { email }
            });

            if (!admin) throw new Error("Admin not found");

            // Cek apakah password cocok
            const passwordCheck = bcrypt.compareSync(password, admin.password);
            if (!passwordCheck) throw new Error("Password invalid");

            // Generate JWT token
            const jwtSecret = process.env.JWT_SECRET;
            const token = jwt.sign(
                { id: admin.id, verified: admin.emailVerified },
                jwtSecret,
                { expiresIn: 3600 }
            );

            // Tentukan waktu kadaluarsa token
            const tokenExp = new Date();
            tokenExp.setHours(tokenExp.getHours() + 1);

            // Update informasi login admin
            await prisma.admin.update({
                where: { id: admin.id },
                data: {
                    logOut: null,
                    loginTimes: admin.loginTimes + 1,
                    token,
                    tokenExp
                }
            });

            res.status(200).json({ status: "success", token });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "failed", message: error.message });
        }
    },
    logoutAdmin: async (req, res) => {
      try {
        const id = req.adminid;
        const admin = await prisma.admin.findUnique({
          where: { id },
        });
        if (!admin) throw new Error("admin not found");
  
        // set logout time
        await prisma.admin.update({
          where: { id },
          data: { logOut: new Date(), token: null, tokenExp: null },
        });
        res.status(200).json({
          status: "Logout successful",
        });
      } catch (error) {
        res.status(400).json({ status: "Logout failed", message: error.message });
      }
    }      
}
