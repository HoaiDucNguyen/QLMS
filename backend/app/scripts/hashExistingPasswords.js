require('dotenv').config({ path: '../../.env' });
const MongoDB = require("../utils/mongodb.util");
const config = require('../config');
const bcrypt = require('bcryptjs');

async function hashExistingPasswords() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");

    const docgiaCollection = MongoDB.client.db().collection("docgia");
    
    // Lấy tất cả đọc giả có mật khẩu chưa được hash
    const readers = await docgiaCollection.find({
      matKhau: { $exists: true },
      $expr: { $lt: [{ $strLenCP: "$matKhau" }, 30] } // Giả sử mật khẩu đã hash sẽ dài hơn 30 ký tự
    }).toArray();

    console.log(`Tìm thấy ${readers.length} đọc giả cần hash mật khẩu`);

    for (const reader of readers) {
      const hashedPassword = await bcrypt.hash(reader.matKhau, 10);
      await docgiaCollection.updateOne(
        { _id: reader._id },
        { $set: { matKhau: hashedPassword } }
      );
      console.log(`Đã hash mật khẩu cho đọc giả: ${reader.maDocGia}`);
    }

    console.log('Hoàn thành hash mật khẩu');
  } catch (error) {
    console.error('Lỗi khi hash mật khẩu:', error);
  } finally {
    if (MongoDB.client) {
      await MongoDB.client.close();
    }
  }
}

// Chạy script
hashExistingPasswords(); 