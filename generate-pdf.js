const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('브로셔 PDF 생성 중...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // HTML 파일 경로
    const htmlPath = path.join(__dirname, 'public', 'brochure-print.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // HTML 로드
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
    });
    
    // PDF 생성 설정
    const pdfOptions = {
        path: path.join(__dirname, 'public', 'brochure.pdf'),
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        }
    };
    
    // PDF 생성
    await page.pdf(pdfOptions);
    
    console.log('✅ 브로셔 PDF가 생성되었습니다:');
    console.log('📁 위치: remen-abs/public/brochure.pdf');
    
    await browser.close();
}

// 스크립트 실행
generatePDF().catch(console.error); 