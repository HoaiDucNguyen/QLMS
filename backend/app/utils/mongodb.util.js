const { MongoClient } = require("mongodb");

class MongoDB {
  static client = null;

  static async connect(uri) {
    if (this.client) return this.client;
    this.client = await MongoClient.connect(uri);
    
    // Thêm phần khởi tạo index
    try {
      const db = this.client.db();
      
      // Tạo các index cho collections
      await Promise.all([
        // Index cho nhà xuất bản
        db.collection("nhaxuatban").createIndex(
          { maNxb: 1 }, 
          { unique: true }
        ),
        
        // Index cho sách
        db.collection("sach").createIndex(
          { maSach: 1 }, 
          { unique: true }
        ),
        
        // Index cho độc giả
        db.collection("docgia").createIndex(
          { maDocGia: 1 }, 
          { unique: true }
        ),
        
        // Index cho theo dõi mượn sách
        db.collection("theodoimuonsach").createIndex(
          { maDocGia: 1, maSach: 1 }
        )
      ]);

      console.log("Database indexes created successfully");
    } catch (error) {
      console.error("Error creating indexes:", error);
      // Không throw error để không ảnh hưởng đến việc kết nối DB
    }

    return this.client;
  }
}

module.exports = MongoDB;