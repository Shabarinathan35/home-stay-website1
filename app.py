
import mysql.connector


def init_database():

    conn = mysql.connector.connect(
        host="127.0.0.1", 
        port=3306,
        user="hotel",
        password="hotel123",
        database="homestay"
    )

    cur = conn.cursor()

    # -------------------------------
    # ADMIN
    # -------------------------------
    cur.execute("""
        CREATE TABLE IF NOT EXISTS admin(
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(20) DEFAULT 'ADMIN'
        )
    """)

    cur.execute("""
        INSERT IGNORE INTO admin(username,password,role)
        VALUES('admin','mysecure123','ADMIN')
    """)

    # -------------------------------
    # LOCATION
    # -------------------------------
    cur.execute("""
        CREATE TABLE IF NOT EXISTS country(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) UNIQUE
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS state(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            country_id INT,
            FOREIGN KEY(country_id) REFERENCES country(id) ON DELETE CASCADE
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS city(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            state_id INT,
            FOREIGN KEY(state_id) REFERENCES state(id) ON DELETE CASCADE
        )
    """)

    # -------------------------------
    # HOTEL
    # -------------------------------
    cur.execute("""
        CREATE TABLE IF NOT EXISTS hotel(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            city_id INT,
            description TEXT,
            image VARCHAR(255)
        )
    """)

    # -------------------------------
    # ROOM
    # -------------------------------
    cur.execute("""
        CREATE TABLE IF NOT EXISTS room(
            id INT AUTO_INCREMENT PRIMARY KEY,
            hotel_id INT,
            price INT,
            available INT DEFAULT 0,
            description TEXT,
            image VARCHAR(255),
            FOREIGN KEY(hotel_id) REFERENCES hotel(id) ON DELETE CASCADE
        )
    """)

    # -------------------------------
    # BOOKING
    # -------------------------------
    cur.execute("""
        CREATE TABLE IF NOT EXISTS booking(
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT,
            name VARCHAR(100),
            phone VARCHAR(20),
            date DATE,
            status VARCHAR(20) DEFAULT 'CONFIRMED',
            FOREIGN KEY(room_id) REFERENCES room(id) ON DELETE CASCADE
        )
    """)

    conn.commit()
    conn.close()

    print("✅ MySQL tables created successfully")


if __name__ == "__main__":
    init_database()
