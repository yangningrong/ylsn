/**
 * 此处做一些框架初始化的操作
 */
(function () {
  window.addEventListener('load', function () {
    // 设置 body 的最小高度为 viewport 的高度，保证 body 至少能占满整个屏幕
    document.body.style.minHeight = (document.documentElement.offsetHeight || document.body.offsetHeight) + 'px';
  });
})();
