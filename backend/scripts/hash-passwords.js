require('dotenv').config();
const MongoDB = require('../app/utils/mongodb.util');
const config = require('../app/config');
const bcrypt = require('bcryptjs');

async function hashPasswords() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");

    const nhanvienCollection = MongoDB.client.db().collection("nhanvien");
    
    // Lấy tất cả nhân viên
    const nhanviens = await nhanvienCollection.find({}).toArray();
    console.log(`Found ${nhanviens.length} employees`);

    // Hash mật khẩu cho từng nhân viên
    for (const nv of nhanviens) {
      try {
        // Lấy mật khẩu hiện tại hoặc dùng mật khẩu mặc định là số điện thoại
        const currentPassword = nv.matKhau || nv.soDienThoai;
        
        // Kiểm tra xem mật khẩu đã được hash chưa
        const isHashed = currentPassword.length > 30; // Một cách đơn giản để kiểm tra
        if (!isHashed) {
          const hashedPassword = await bcrypt.hash(currentPassword, 10);
          
          await nhanvienCollection.updateOne(
            { _id: nv._id },
            { $set: { matKhau: hashedPassword } }
          );
          
          console.log(`Updated password for employee ${nv.maNV} - ${nv.hoLot} ${nv.ten}`);
        } else {
          console.log(`Password already hashed for employee ${nv.maNV}`);
        }
      } catch (error) {
        console.error(`Error updating password for employee ${nv.maNV}:`, error);
      }
    }

    console.log("\nPassword update summary:");
    console.log("All employees now have hashed passwords");
    console.log("\nYou can login with:");
    console.log("- Phone number of any employee");
    console.log("- Password: same as their original password or phone number if no password was set");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await MongoDB.client.close();
  }
}

hashPasswords(); 