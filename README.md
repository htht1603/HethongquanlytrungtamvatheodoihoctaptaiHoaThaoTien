# Hoa Thao Tien Education Management

Giao dien quan ly giao duc front-end cho trung tam Hoa Thao Tien. Du an la website tinh toan HTML, CSS va JavaScript thuần, gom cac nghiep vu cho khach, quan tri vien, giao vien va phu huynh.

## Tinh nang

- Trang chu va thong tin trung tam cho khach
- Danh sach lop, chi tiet lop hoc va tư van AI
- Dang nhap theo vai tro: Admin, Giao vien, Phu huynh
- Quan ly hoc sinh, lop hoc, mon hoc, hoc phi va lich hoc
- Quan tri tai khoan, thong bao, diem danh va bai tap
- Thong tin lich day, lich hoc, hoc phi va thong bao cho tung vai tro

> Day la ban giao dien demo, du lieu va dang nhap hien duoc xu ly o phia client va chua ket noi co so du lieu.

## Cong nghe

- HTML5
- CSS3
- JavaScript thuần
- Node.js va npm de chay may chu phat trien
- Live Server thong qua `live-server`

## Cau truc thu muc

```text
.
├── index.html                 # Trang chuyen huong vao giao dien khach
├── login.html                 # Man hinh dang nhap
├── guest/                     # Trang danh cho khach
│   ├── guest.html
│   ├── guest_classes.html
│   ├── guest_class_detail.html
│   └── ai_advisor.html
├── admin/                     # Trang quan tri
│   ├── dashboard.html
│   ├── accounts.html
│   ├── classes.html
│   ├── students.html
│   ├── subjects.html
│   ├── teachers.html
│   ├── timetable.html
│   ├── fees.html
│   └── notifications.html
├── teacher/                   # Trang giao vien
├── parent/                    # Trang phu huynh
├── css/                       # Style cho tung nhom trang
├── js/                        # JavaScript cho cac chuc nang giao dien
├── assets/                    # Hinh anh va tai nguyen
├── package.json
└── package-lock.json
```

## Yeu cau

- Node.js 16 trỏ len
- npm đi kem Node.js
- Trinh duyet hien dai

## Cai dat va chay du an

1. Mo terminal tai thu muc du an:

```powershell
cd "D:\Thực tập"
```

2. Cai dat cac goi phu thuoc:

```bash
npm install
```

3. Khoi dong may chu phat trien:

```bash
npm run dev
```

4. Mo trinh duyet tai dia chi:

```text
http://localhost:8080
```

Co the mo [index.html](index.html) truc tiep bang trinh duyet, tuy nhien chay qua Live Server se on dinh hon voi lien ket va tai nguyen.

## Tai khoan demo

Tai khoan dang nhap hien tai duoc kiem tra theo ten dang nhap. Mat khau khong duoc kiem tra trong phien ban demo.

| Vai tro | Ten dang nhap |
|---|---|
| Admin | `admin` |
| Giao vien | `teacher` |
| Phu huynh | `parent` |

Sau khi dang nhap, ban se duoc chuyen den khu vuc tuong ung.

## Day du an len Git

Neu thu muc chua khoi tao Git, chay:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <URL_REPOSITORY_GIT>
git push -u origin main
```

Neu da co repository va remote:

```bash
git add .
git commit -m "Cap nhat giao dien"
git push
```

Kiem tra remote hien tai bang:

```bash
git remote -v
```
