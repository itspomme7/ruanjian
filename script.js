// 简单交互脚本：切换目录、注入生成时间、下载 Markdown 文本
document.addEventListener('DOMContentLoaded', function () {
  const toc = document.getElementById('toc');
  const toggle = document.getElementById('toggle-toc');
  const genTime = document.getElementById('generated-time');
  const downloadMd = document.getElementById('download-md');

  // 生成时间
  const now = new Date();
  genTime.textContent = now.toLocaleString();

  toggle.addEventListener('click', function(){
    if(window.innerWidth <= 900){
      // mobile: scroll to toc or toggle visibility
      if(toc.style.display === 'block'){
        toc.style.display = 'none';
      } else {
        toc.style.display = 'block';
      }
    } else {
      // desktop: collapse vs expand
      if(toc.style.width === '0px' || toc.style.display === 'none'){
        toc.style.display = 'block';
      } else {
        toc.style.display = 'none';
      }
    }
  });

  // 下载 Markdown（把页面内容导出为简化的 Markdown）
  downloadMd.addEventListener('click', function(e){
    e.preventDefault();
    const md = buildMarkdown();
    const blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    downloadMd.href = url;
    // 点击后浏览器会下载，释放 URL 在下一帧
    setTimeout(()=> URL.revokeObjectURL(url), 10000);
  });

  // 构建简化 Markdown：将页面内标题与段落提取
  function buildMarkdown(){
    const title = document.querySelector('header h1').innerText.trim();
    let md = `# ${title}\n\n`;
    const sections = document.querySelectorAll('article .card');
    sections.forEach(sec => {
      const h = sec.querySelector('h2');
      if(h) md += `## ${h.innerText.trim()}\n\n`;
      const paras = sec.querySelectorAll('p, li, td');
      paras.forEach(p => {
        let text = p.innerText.trim();
        if(text) md += text + '\n\n';
      });
    });
    md += `*生成时间：${new Date().toLocaleString()}*`;
    return md;
  }
});