define([], function () {
  "use strict";
  return navigator.clipboard || {
    writeText: (text) => {
      let textArea = document.getElementById("tempClipboard")
      if (!textArea) { // 没有临时剪切板存储控件时创建
        textArea = document.createElement('textArea')
        textArea.setAttribute("id", "tempClipboard")
        // 设置高宽为 0 不可见
        textArea.style.padding = "0"
        textArea.style.width = "0"
        textArea.style.height = "0"
        // 移到屏幕外
        textArea.style.position = "absolute"
        textArea.style.right = "0"
        textArea.style.bottom = "0"
        document.body.appendChild(textArea)
      }
      textArea.value = text
      // 显示临时文本框
      textArea.style.display = "block"
      textArea.select()
      document.execCommand("copy")
      // 隐藏临时文本框和清空内容
      textArea.style.display = "none"
      textArea.value = null
    }
  }
})
