import axios from 'axios';

const testUrl = process.argv[2];

if (!testUrl) {
  console.log('Usage: node server/test-download.js <url>');
  console.log('Example: node server/test-download.js "https://sns-webpic-qc.xhscdn.com/..."');
  process.exit(1);
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Referer': 'https://www.xiaohongshu.com/',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9',
};

console.log('Testing URL:', testUrl);
console.log('Headers:', headers);
console.log('---');

axios.get(testUrl, { headers, responseType: 'arraybuffer', timeout: 30000 })
  .then(res => {
    console.log('SUCCESS!');
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Length:', res.headers['content-length']);
  })
  .catch(err => {
    console.log('FAILED!');
    console.log('Status:', err.response?.status);
    console.log('Error:', err.message);
    if (err.response?.headers) {
      console.log('Response headers:', err.response.headers);
    }
  });
