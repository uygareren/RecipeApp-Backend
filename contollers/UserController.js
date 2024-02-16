const User = require("../modal/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const { trace } = require("../routers/User");


exports.register = async (req, res, next) => {
    const { name, surname, email, password_1, password_2 } = req.body;

    if (password_1 !== password_2) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    try {
        // Wait for the query to finish and get the result
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password_1, 10);

        const user = new User({
            name,
            surname,
            email,
            password: hashedPassword
        });

        const result = await user.save();
        return res.status(200).json({ status: 200, success: true, data: { name, surname, email } });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Kullanıcının e-posta adresine göre veritabanında arama yap
        const user = await User.findOne({ email });

        // Kullanıcı bulunamazsa
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Şifreyi kontrol et
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Giriş başarılı ise token oluştur ve kullanıcı bilgilerini döndür
        const token = jwt.sign({ userId: user._id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

        return res.status(200).json({
            status: 200,
            success: true,
            data: { userId: user._id, name: user.name, surname: user.surname, email: user.email },
            token: token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.updatePassword = async (req, res, next) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Kullanıcının ID'sine göre veritabanında arama yap
        const user = await User.findById(userId);

        // Kullanıcı bulunamazsa
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Mevcut şifreyi kontrol et
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        // Yeni şifreyi hashle
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Şifreyi güncelle
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ status: 200, success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.logout = (req, res) => {
    
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    try {
        // Token'ı doğrula ve geçersiz kılma işlemleri
        jwt.verify(token, 'your_secret_key');
        // Token'ı geçersiz kılma veya sıfırlama işlemleri

        // Başarıyla çıkış yapıldığını belirt
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
};


exports.updateProfile = async (req, res, next) => {
    const {user_id, name, surname, image, phone, country, city} = req.body;

    if(!user_id || !name || !surname || !image || !phone || !country || !city){
        return res.status(400).json({status: 400, success:false, message: "Error"})
    }

    try {
        const user = await User.findById(user_id);

        user.name = name;
        user.surname = surname;
        user.image = image;
        user.phone = phone;
        user.country = country;
        user.city = city;
        
        await user.save();

        return res.status(200).json({status:200, success:true, message:"Succesfull"});

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error" });
    }

}

exports.getUserDetail = async (req, res, next) => {
    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({status: 400, success:false, message: "Error"})
    }

    try {
        const user = await User.findById(user_id);
        if(user){
            return res.status(200).json({status:200, success:true, message: "Successfull", user})
        }else{
            return res.status(400).json({status: 400, success:false, message: "No any user!"})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error" });
    }
}


exports.postInterests = async (req, res, next) => {

    const {user_id, interests_data} = req.body;

    if(!interests_data || !user_id){
        return res.status(400).json({status: 400, success:false, message: "Interests Data and User id is required!"})
    }

    try {

        const user = await User.findById(user_id);

        user.interests = interests_data;

        await user.save();

        return res.status(200).json({status: 200, success:true, message: "Successfull!"})
        
    } catch (error) {
        return res.status(500).json({status:500, success: false, message: "Error" });
    }

}

