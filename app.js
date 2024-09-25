const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit'); // fontkit 등록
const path = require('path');

const app = express();
const port = 3000;

// Multer 설정 (업로드된 파일 저장)
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// fontkit의 UMD 빌드 서빙
app.get('/fontkit.umd.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/fontkit/dist/fontkit.umd.js'));
});


// PDF 업로드 및 편집 라우트
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const pdfBytes = fs.readFileSync(pdfPath);

    // PDF 파일 로드 및 수정
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit); // fontkit 등록
    

    // 한글 폰트 사용
    const fontPath = path.join(__dirname, 'public', 'NanumGothic-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const koreanFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // 텍스트 추가 (한글 지원)
    firstPage.drawText('안녕하세요, PDF-lib!', {
      x: 50,
      y: height - 50,
      size: 30,
      font: koreanFont,
      color: rgb(0, 0.53, 0.71),
    });

    // 편집된 PDF 저장
    const editedPdfBytes = await pdfDoc.save();
    const editedPdfPath = path.join('uploads', 'edited.pdf');
    fs.writeFileSync(editedPdfPath, editedPdfBytes);

    // 클라이언트에게 편집된 파일 경로 전송
    res.json({ downloadUrl: `/uploads/edited.pdf` });
  } catch (error) {
    console.error(error);
    res.status(500).send('PDF 파일을 처리하는 중 오류가 발생했습니다.');
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
